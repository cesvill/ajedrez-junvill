"""
Pruebas Automatizadas de Calidad & Seguridad GitOps: Ajedrez Junvill
Verifica la erradicación de contraseñas en texto plano, aislamiento de residuos
Vibe Coding, configuración Zero-DLP y cumplimiento de empaquetado.
"""

import os
import json
import re
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent

def test_no_plaintext_passwords_in_database():
    """Valida que users_db.json no contenga contraseñas en texto plano (CWE-256 / CWE-312)."""
    db_file = ROOT_DIR / "database" / "users_db.json"
    assert db_file.is_file(), "database/users_db.json debe existir"

    content = db_file.read_text(encoding="utf-8")
    assert "JunV1ll123" not in content, "Fallo crítico: Contraseña en texto plano encontrada en users_db.json"
    assert '"password":' not in content, "No debe existir el atributo 'password' en texto plano"

    data = json.loads(content)
    for group in data:
        assert "passwordHash" in group, "Cada grupo debe definir 'passwordHash'"
        assert len(group["passwordHash"]) == 64, "passwordHash debe ser un hash SHA-256 de 64 caracteres"

def test_zero_dlp_no_public_mock_api_in_sync():
    """Valida que api/sync.js no realice llamadas a restful-api.dev (CWE-359 / CWE-312)."""
    sync_file = ROOT_DIR / "api" / "sync.js"
    assert sync_file.is_file(), "api/sync.js debe existir"

    content = sync_file.read_text(encoding="utf-8")
    assert "restful-api.dev" not in content, "Fallo crítico: api/sync.js todavía envía datos a restful-api.dev"

def test_vibe_coding_quarantine_hygiene():
    """Valida que los scripts temporales de scratch/ estén aislados y sellados en .gitignore (CWE-710)."""
    gitignore_file = ROOT_DIR / ".gitignore"
    assert gitignore_file.is_file(), ".gitignore debe existir"

    gitignore_content = gitignore_file.read_text(encoding="utf-8")
    assert "_quarantine_legacy/" in gitignore_content, ".gitignore debe sellar _quarantine_legacy/"
    assert "scratch/" in gitignore_content, ".gitignore debe sellar scratch/"

    # La raíz no debe tener archivos .zip ni .docx sueltos
    root_zips = list(ROOT_DIR.glob("*.zip"))
    root_docs = list(ROOT_DIR.glob("*.docx"))
    assert len(root_zips) == 0, f"Existen archivos ZIP sueltos en la raíz: {root_zips}"
    assert len(root_docs) == 0, f"Existen documentos DOCX sueltos en la raíz: {root_docs}"

def test_env_example_exists_and_clean():
    """Valida la existencia y limpieza de .env.example (SEC-STD-001)."""
    env_example = ROOT_DIR / ".env.example"
    assert env_example.is_file(), ".env.example debe existir en la raíz"

    content = env_example.read_text(encoding="utf-8")
    assert "JunV1ll123" not in content, ".env.example no debe contener contraseñas reales"
    assert "VITE_APP_TITLE" in content, ".env.example debe documentar variables clave"

def test_crypto_auth_module_exists_and_tested():
    """Comprueba la existencia del módulo de hashing seguro src/engine/cryptoAuth.js."""
    crypto_module = ROOT_DIR / "src" / "engine" / "cryptoAuth.js"
    assert crypto_module.is_file(), "src/engine/cryptoAuth.js debe existir"
    content = crypto_module.read_text(encoding="utf-8")
    assert "hashPassword" in content
    assert "verifyPassword" in content
