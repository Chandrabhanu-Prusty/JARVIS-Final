import subprocess

from fastapi import APIRouter, HTTPException, status

from app.schemas import ActionRequest, ActionResponse

router = APIRouter(prefix="/api", tags=["actions"])

# This mapping is intentionally static. User input and LLM output are never used
# as paths, executable names, arguments, or shell fragments.
ALLOWED_ACTIONS: dict[str, tuple[str, ...]] = {
    "open-calculator": ("calc.exe",),
    "open-notepad": ("notepad.exe",),
    "open-file-explorer": ("explorer.exe",),
}


@router.post("/actions", response_model=ActionResponse)
async def run_action(request: ActionRequest) -> ActionResponse:
    if not request.confirmed:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Explicit confirmation is required before opening a local application.",
        )
    try:
        subprocess.Popen(ALLOWED_ACTIONS[request.action], shell=False)
    except OSError as error:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="The approved Windows application could not be opened.") from error
    return ActionResponse(action=request.action, status="opened")
