from fastapi import APIRouter, HTTPException, status

from app.schemas import WebActionPlanRequest, WebActionPlanResponse
from app.services.web_action_planner import make_web_action_plan, open_web_url

router = APIRouter(prefix="/api/web-actions", tags=["web-actions"])


@router.post("/plan", response_model=WebActionPlanResponse)
async def plan_web_action(request: WebActionPlanRequest) -> WebActionPlanResponse:
    return WebActionPlanResponse(**make_web_action_plan(request.text.strip()))


@router.post("/open", response_model=WebActionPlanResponse)
async def open_web_action(request: WebActionPlanRequest) -> WebActionPlanResponse:
    plan = make_web_action_plan(request.text.strip())
    try:
        open_web_url(plan["url"])
    except Exception as error:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(error)) from error
    return WebActionPlanResponse(**plan)

