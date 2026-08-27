"""Bundled FastAPI entry point used only by the Tauri Windows sidecar."""

import uvicorn


def main() -> None:
    uvicorn.run("app.main:app", host="127.0.0.1", port=8765, log_level="warning")


if __name__ == "__main__":
    main()
