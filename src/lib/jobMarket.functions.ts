import { createServerFn } from "@tanstack/react-start";

export type JobRole = {
  role: string;
  baseMedian: number;
  demand: string;
  openings: number;
  topSkills: string[];
  salaryByLocation: Record<string, number>;
  salaryByExperience: Record<string, number>;
  trend: { months: string[]; values: number[] };
};

export type JobMarket = {
  currency: string;
  locations: string[];
  experienceLevels: string[];
  roles: JobRole[];
};

export const getJobMarket = createServerFn({ method: "GET" }).handler(
  async (): Promise<JobMarket> => {
    const { supabaseAdmin } = await import(
      "@/integrations/supabase/client.server"
    );

    const { data, error } = await supabaseAdmin
      .from("job_roles")
      .select(
        "role, base_median, demand, openings, top_skills, salary_by_location, salary_by_experience, trend",
      )
      .order("base_median", { ascending: false });

    if (error) throw new Error(error.message);

    const roles: JobRole[] = (data ?? []).map((r) => ({
      role: r.role as string,
      baseMedian: Number(r.base_median),
      demand: r.demand as string,
      openings: r.openings as number,
      topSkills: (r.top_skills ?? []) as string[],
      salaryByLocation: (r.salary_by_location ?? {}) as Record<string, number>,
      salaryByExperience: (r.salary_by_experience ?? {}) as Record<
        string,
        number
      >,
      trend: (r.trend ?? { months: [], values: [] }) as {
        months: string[];
        values: number[];
      },
    }));

    // Derive the union of locations across roles (stable order from first role).
    const locations = roles.length ? Object.keys(roles[0].salaryByLocation) : [];
    const experienceLevels = roles.length
      ? Object.keys(roles[0].salaryByExperience)
      : [];

    return {
      currency: "INR LPA",
      locations,
      experienceLevels,
      roles,
    };
  },
);
