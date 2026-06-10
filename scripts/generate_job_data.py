"""
Generate a realistic job-market dataset for JobPulse.

Run: python scripts/generate_job_data.py
Output: src/data/jobMarket.json

The website reads this JSON and, based on the user's input
(job role, location, average package), computes a live analysis:
market comparison, salary range, demand level and top skills.
"""

import json
import os
import random

random.seed(42)

# Base annual salaries in INR Lakhs Per Annum (LPA) for India-style market.
ROLES = {
    "Software Engineer": {"base": 9.0, "skills": ["Java", "Python", "SQL", "Git", "REST APIs", "Data Structures"]},
    "Frontend Developer": {"base": 8.0, "skills": ["React", "TypeScript", "CSS", "HTML", "Next.js", "Redux"]},
    "Backend Developer": {"base": 9.5, "skills": ["Node.js", "Python", "PostgreSQL", "Docker", "Microservices", "Redis"]},
    "Full Stack Developer": {"base": 10.0, "skills": ["React", "Node.js", "MongoDB", "AWS", "TypeScript", "Docker"]},
    "Data Scientist": {"base": 12.0, "skills": ["Python", "Machine Learning", "SQL", "Pandas", "TensorFlow", "Statistics"]},
    "Data Analyst": {"base": 7.0, "skills": ["SQL", "Excel", "Power BI", "Python", "Tableau", "Statistics"]},
    "DevOps Engineer": {"base": 11.0, "skills": ["AWS", "Kubernetes", "Docker", "Terraform", "CI/CD", "Linux"]},
    "Machine Learning Engineer": {"base": 14.0, "skills": ["Python", "PyTorch", "MLOps", "AWS", "Deep Learning", "SQL"]},
    "Product Manager": {"base": 16.0, "skills": ["Roadmapping", "Analytics", "SQL", "Agile", "Stakeholder Mgmt", "UX"]},
    "UI/UX Designer": {"base": 7.5, "skills": ["Figma", "Prototyping", "User Research", "Design Systems", "Wireframing", "Adobe XD"]},
    "QA Engineer": {"base": 6.5, "skills": ["Selenium", "Automation", "API Testing", "Jira", "Python", "Cypress"]},
    "Cloud Architect": {"base": 22.0, "skills": ["AWS", "Azure", "GCP", "Terraform", "Networking", "Security"]},
}

# City cost-of-living / pay multipliers.
LOCATIONS = {
    "Bangalore": 1.20,
    "Hyderabad": 1.05,
    "Pune": 1.00,
    "Mumbai": 1.15,
    "Delhi NCR": 1.10,
    "Chennai": 0.95,
    "Remote": 1.08,
    "Kolkata": 0.85,
    "Ahmedabad": 0.80,
    "Noida": 1.02,
}

EXPERIENCE = {
    "Entry (0-2 yrs)": 0.7,
    "Mid (3-5 yrs)": 1.2,
    "Senior (6-9 yrs)": 1.9,
    "Lead (10+ yrs)": 2.8,
}


def trend_for(role: str) -> dict:
    """Build a 6-month hiring-demand trend (index 0-100)."""
    months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
    start = random.randint(45, 70)
    values = []
    v = start
    for _ in months:
        v = max(20, min(100, v + random.randint(-6, 12)))
        values.append(v)
    return {"months": months, "values": values}


def demand_level(role_base: float) -> str:
    if role_base >= 13:
        return "Very High"
    if role_base >= 9:
        return "High"
    if role_base >= 7:
        return "Moderate"
    return "Steady"


def build_dataset() -> dict:
    roles = []
    for role, cfg in ROLES.items():
        base = cfg["base"]
        salary_by_location = {}
        for city, mult in LOCATIONS.items():
            salary_by_location[city] = round(base * mult, 1)

        salary_by_experience = {}
        for level, mult in EXPERIENCE.items():
            salary_by_experience[level] = round(base * mult, 1)

        roles.append({
            "role": role,
            "baseMedian": base,
            "demand": demand_level(base),
            "openings": random.randint(1200, 9800),
            "topSkills": cfg["skills"],
            "salaryByLocation": salary_by_location,
            "salaryByExperience": salary_by_experience,
            "trend": trend_for(role),
        })

    return {
        "currency": "INR LPA",
        "updatedAt": "2026-06-10",
        "locations": list(LOCATIONS.keys()),
        "experienceLevels": list(EXPERIENCE.keys()),
        "roles": roles,
    }


def main() -> None:
    data = build_dataset()
    out_dir = os.path.join("src", "data")
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, "jobMarket.json")
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)
    print(f"Wrote {len(data['roles'])} roles -> {out_path}")


if __name__ == "__main__":
    main()
