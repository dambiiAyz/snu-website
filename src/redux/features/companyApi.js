import { apiSlice } from "../api/apiSlice";

export function normalizeCompanyListResponse(res) {
  if (!res) return [];
  const raw = res.data !== undefined ? res.data : res;
  if (Array.isArray(raw)) return raw;
  if (raw && Array.isArray(raw.items)) return raw.items;
  if (raw && Array.isArray(raw.companies)) return raw.companies;
  return [];
}

export function normalizeCompanyDetailResponse(res) {
  if (!res) return null;
  const raw = res.data !== undefined ? res.data : res;
  if (raw && typeof raw === "object" && (raw.name || raw.slug)) return raw;
  if (raw?.company && typeof raw.company === "object") return raw.company;
  return null;
}

export const companyApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getPublicCompanies: builder.query({
      query: () => ({
        url: "/api/companies/public",
        method: "GET",
      }),
      providesTags: ["Companies"],
    }),
    getPublicCompanyBySlug: builder.query({
      query: (slug) => ({
        url: `/api/companies/public/${encodeURIComponent(slug)}`,
        method: "GET",
      }),
      providesTags: (result, error, slug) => [{ type: "Company", id: slug }],
    }),
  }),
});

export const { useGetPublicCompaniesQuery, useGetPublicCompanyBySlugQuery } =
  companyApi;
