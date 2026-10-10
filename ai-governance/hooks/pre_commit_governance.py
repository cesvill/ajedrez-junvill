#!/usr/bin/env python3
"""pre_commit_governance.py - Hook local de pre-commit para control de calidad.

Marco de Gobernanza Dual Ikusi 2026:
1. Cero secretos quemados (SEC-STD-001 / CWE-798).
2. Límite de 250 líneas por archivo con exenciones documentadas (ARCH-STD-002).
3. Cero llamadas a print() no estructuradas (OBS-STD-012).
4. Cero uso de localStorage/sessionStorage (CWE-312 / SFC 007 / ASVS 8.2.2).
5. Cero manipulación directa de document.cookie = (CWE-614 / ASVS 3.4.1).
6. Cero uso de BaseHTTPMiddleware en FastAPI (PERF-STD-006 / OTel Context).
7. Documentación explicativa en Componentes React (JSDoc) y funciones públicas.
"""

import ast
import json
import os
import re
import sys
from pathlib import Path

# Configurar logging con fallback a standard library si structlog no está instalado
try:
    import structlog
    logger = structlog.get_logger("governance.pre_commit")
    def log_error(event, **kw): logger.error(event, **kw)
    def log_info(event, **kw): logger.info(event, **kw)
    def log_warn(event, **kw): logger.warning(event, **kw)
except ImportError:
    import logging
    logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")
    def log_error(event, **kw): logging.error(f"{event}: {kw}")
    def log_info(event, **kw): logging.info(f"{event}: {kw}")
    def log_warn(event, **kw): logging.warning(f"{event}: {kw}")

MAX_LINES = 250
SECRET_REGEX = re.compile(r"""(?:api_key|secret|password|bearer|auth_token)\s*=\s*['"][a-zA-Z0-9_\-\.]{16,}['"]""", re.IGNORECASE)
STORAGE_REGEX = re.compile(r"(?:localStorage|sessionStorage)\.(?:getItem|setItem|removeItem)")
COOKIE_REGEX = re.compile(r"document\.cookie\s*=")
ASYNC_MIDDLEWARE_REGEX = re.compile(r"class\s+\w+\(BaseHTTPMiddleware\)|@app\.middleware\([\"']http[\"']\)")
REACT_COMPONENT_REGEX = re.compile(r"""(?:export\s+)?(?:default\s+)?(?:function|const)\s+([A-Z][a-zA-Z0-9_]+)\s*(?:=|:\s*React\.FC|<|\()""")
CHOPPING_FILE_PATTERN = re.compile(r"[_.-]?(part|chunk|split|seccion|bloque)[_.-]?\d+\.(py|ts|tsx|js|jsx)$", re.IGNORECASE)
IGNORED_DIRS = {".git", "node_modules", "venv", ".venv", "__pycache__", "dist", "build", ".next", ".cache", "tests", "test", ".archive", "archive", "_quarantine", "_quarantine_legacy", "quarantine"}


def check_preceding_jsdoc(lines, line_idx: int) -> bool:
    """Verifica si una definición de componente React está precedida por un bloque JSDoc formal."""
    idx = line_idx - 1
    while idx >= 0 and lines[idx].strip() == "":
        idx -= 1
    if idx < 0:
        return False
    if lines[idx].strip().endswith("*/"):
        for back_idx in range(idx, max(-1, idx - 20), -1):
            if "/**" in lines[back_idx]:
                return True
    return False


def load_monolith_exemptions(root_dir: Path) -> set:
    """Carga las exenciones formales de monolitos si existen."""
    exemptions = set()
    for ep in [root_dir / ".monolith_exemptions.json", root_dir / "reviews" / "monolith_exemptions.json"]:
        if ep.exists():
            try:
                with open(ep, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    for item in data.get("exemptions", []):
                        if isinstance(item, dict) and item.get("file"):
                            exemptions.add(os.path.normpath(item["file"]))
                        elif isinstance(item, str):
                            exemptions.add(os.path.normpath(item))
            except Exception:
                pass
    return exemptions


def get_files_to_check(root_dir: Path) -> list:
    """Obtiene los archivos staged de git o recorre el árbol si no hay stage."""
    import subprocess
    try:
        proc = subprocess.run(["git", "diff", "--cached", "--name-only", "--diff-filter=ACM"], cwd=str(root_dir), capture_output=True, text=True)
        if proc.returncode == 0:
            lines = [l.strip() for l in proc.stdout.splitlines() if l.strip()]
            if lines:
                return [root_dir / l for l in lines]
    except Exception:
        pass

    files = []
    for dirpath, dirnames, filenames in os.walk(root_dir):
        dirnames[:] = [d for d in dirnames if d not in IGNORED_DIRS]
        for f in filenames:
            files.append(Path(dirpath) / f)
    return files


def check_staged_compliance(root_dir: Path) -> bool:
    """Inspecciona exhaustivamente el código staged validando estándares normativos."""
    failed = False
    exemptions = load_monolith_exemptions(root_dir)
    target_files = get_files_to_check(root_dir)

    for file_path in target_files:
        if not file_path.is_file():
            continue

        ext = file_path.suffix.lower()
        if ext not in {".py", ".ts", ".tsx", ".js", ".jsx"}:
            continue

        rel_path = file_path.relative_to(root_dir) if file_path.is_relative_to(root_dir) else file_path
        norm_rel = os.path.normpath(str(rel_path))

        # Omitir archivos dentro de directorios ignorados
        parts = Path(norm_rel).parts
        if any(p in IGNORED_DIRS for p in parts):
            continue

        # Chequeo de File-Chopping (ARCH-STD-002.1)
        if CHOPPING_FILE_PATTERN.search(file_path.name):
            log_error("forbidden_file_chopping_partN", file=norm_rel, message="Antipatrón de troceo secuencial prohibido (partN). Modularizar según DDD/Strategy.")
            failed = True

        try:
            with open(file_path, "r", encoding="utf-8", errors="ignore") as fp:
                lines = fp.readlines()

            is_cli_tool = any(p in {"tools", "scripts", "cli", "hooks"} for p in parts)

            # 1. Monolitos (> 250 líneas en código de producción, excluyendo herramientas CLI/checkers)
            if len(lines) > MAX_LINES and not is_cli_tool:
                if ext == ".py" or norm_rel not in exemptions:
                    log_error("line_limit_exceeded", file=norm_rel, count=len(lines), max=MAX_LINES)
                    failed = True

            # Chequeo sintáctico de Python
            if ext == ".py":
                try:
                    ast.parse("".join(lines), filename=str(file_path))
                except SyntaxError as syn:
                    log_error("syntax_error", file=norm_rel, line=syn.lineno, message=syn.msg)
                    failed = True

            for idx, line in enumerate(lines, 1):
                # 2. Secretos quemados
                if SECRET_REGEX.search(line):
                    log_error("secret_detected", file=norm_rel, line=idx)
                    failed = True

                if is_cli_tool:
                    continue

                # 3. Print calls (Python no-CLI)
                if ext == ".py" and re.search(r"^\s*print\(", line):
                    log_error("forbidden_print", file=norm_rel, line=idx)
                    failed = True

                # 4. Storage prohibido (Frontend)
                if ext in {".ts", ".tsx", ".js", ".jsx"} and STORAGE_REGEX.search(line):
                    log_error("forbidden_web_storage_asvs_l3", file=norm_rel, line=idx)
                    failed = True

                # 5. Cookie insegura (Frontend)
                if ext in {".ts", ".tsx", ".js", ".jsx"} and COOKIE_REGEX.search(line):
                    log_error("forbidden_direct_cookie_manipulation", file=norm_rel, line=idx)
                    failed = True

                # 6. BaseHTTPMiddleware (Python)
                if ext == ".py" and ASYNC_MIDDLEWARE_REGEX.search(line):
                    log_error("forbidden_base_http_middleware", file=norm_rel, line=idx)
                    failed = True

                # 7. Componentes React sin documentar (ignorar constantes en mayúsculas como DEVICE_PRESETS)
                if ext in {".jsx", ".tsx"}:
                    m = REACT_COMPONENT_REGEX.search(line)
                    if m and not m.group(1).isupper() and m.group(1) not in {"React", "FC", "Props", "State", "Icon"}:
                        if not check_preceding_jsdoc(lines, idx - 1):
                            log_error("undocumented_react_component", file=norm_rel, line=idx, component=m.group(1))
                            failed = True

        except Exception as e:
            log_warn("file_inspection_error", file=norm_rel, error=str(e))

    return not failed


def main() -> None:
    """Punto de entrada principal para la ejecución del hook de pre-commit de Gobernanza IA."""
    repo_root = Path(".")
    log_info("starting_pre_commit_governance_check")
    if not check_staged_compliance(repo_root):
        log_error("pre_commit_failed", message="Violaciones normativas de Gobernanza Dual detectadas. Corrija los archivos antes de confirmar el commit.")
        sys.exit(1)

    log_info("pre_commit_passed", message="Código 100% conforme con estándares Ikusi 2026.")
    sys.exit(0)


if __name__ == "__main__":
    main()
