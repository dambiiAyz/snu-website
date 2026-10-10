import InviteLanding from "@/components/invite/invite-landing";

export const metadata = {
  title: "Snuu урилга",
  description: "Snuu апп эсвэл вэбээр урилгын кодтой бүртгүүлэх",
};

export default async function InvitePage({ searchParams }) {
  const params = await searchParams;
  const rawCode = params?.ref;
  const code = typeof rawCode === "string" ? rawCode.trim().toUpperCase() : "";
  const referralCode = /^[A-Z0-9_-]{1,64}$/.test(code) ? code : "";

  return <InviteLanding referralCode={referralCode} />;
}
