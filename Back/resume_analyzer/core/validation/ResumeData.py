from pydantic import BaseModel
from typing import List

class ResumeData(BaseModel):
    user_id: int
    skills: List[str]
    experience: str
    education: str
