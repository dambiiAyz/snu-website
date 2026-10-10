import AccountDeletionRequest from "@/components/account-deletion/account-deletion-request";

export const metadata = {
  title: "Аккаунт устгах хүсэлт",
  description: "Snuu аккаунт болон холбогдох өгөгдлийг устгуулах хүсэлт",
};

export default function DeleteAccountPage() {
  return <AccountDeletionRequest />;
}
