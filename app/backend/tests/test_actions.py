from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_action_requires_confirmation(monkeypatch) -> None:
    monkeypatch.setattr("app.api.actions.subprocess.Popen", lambda *_args, **_kwargs: None)
    response = client.post("/api/actions", json={"action": "open-calculator", "confirmed": False})
    assert response.status_code == 409


def test_action_uses_only_allowlisted_command(monkeypatch) -> None:
    received: list[tuple[tuple[str, ...], bool]] = []

    def fake_popen(command: tuple[str, ...], *, shell: bool) -> None:
        received.append((command, shell))

    monkeypatch.setattr("app.api.actions.subprocess.Popen", fake_popen)
    response = client.post("/api/actions", json={"action": "open-calculator", "confirmed": True})
    assert response.status_code == 200
    assert response.json() == {"action": "open-calculator", "status": "opened"}
    assert received == [(("calc.exe",), False)]


def test_action_rejects_non_allowlisted_name() -> None:
    response = client.post("/api/actions", json={"action": "powershell.exe", "confirmed": True})
    assert response.status_code == 422
