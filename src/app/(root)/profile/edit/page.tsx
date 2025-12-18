import { getServerSession } from "@/lib/session";
import {
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui";
import UserAvatar from "@/components/modules/profile/UserAvatar";
import ProfileForm from "../../../../components/modules/profile/ProfileForm";
import { notFound, redirect } from "next/navigation";
import { orpc } from "@/lib/orpc";
import { getQueryClient } from "@/lib/query/hydration";

const EditProfile = async () => {
  const session = await getServerSession();
  if (!session?.user) return redirect("/login");

  const queryClient = getQueryClient();
  const userResult = await queryClient.fetchQuery(
    orpc.user.get.queryOptions({
      input: { userId: session.user.id },
    })
  );

  if (!userResult) return notFound();

  const { user } = userResult;

  return (
    <div className="mx-auto w-full">
      <FieldSet>
        <FieldLegend className="h1-bold!">Profile Settings</FieldLegend>
        <FieldDescription className="pg-regular! text-light-500">
          Manage your personal information
        </FieldDescription>
        <FieldSeparator />
        <FieldGroup className="mt-4 flex flex-col-reverse items-start gap-10 md:flex-row md:gap-16 xl:gap-24">
          <ProfileForm user={user} />
          <FieldGroup className="flex flex-col items-center py-0 md:w-64 md:items-start md:pr-32 xl:w-72">
            <FieldLabel className="h3-bold! text-nowrap">
              Profile picture
            </FieldLabel>
            <UserAvatar
              href={null}
              id={user?.id}
              name={user?.name}
              image={user?.image ?? ""}
              className="size-36 rounded-full object-cover md:size-48"
              fallbackClassName="text-7xl md:text-8xl font-bold"
            />
          </FieldGroup>
        </FieldGroup>
      </FieldSet>
    </div>
  );
};

export default EditProfile;
