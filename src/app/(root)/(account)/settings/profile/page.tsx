import { orpc } from "@/lib/orpc";
import { notFound, redirect } from "next/navigation";
import { getQueryClient } from "@/lib/query/hydration";
import { getServerSession } from "@/lib/session";
import {
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import ProfileForm from "@/components/modules/profile/profile-form";
import AvatarEditor from "@/components/modules/profile/avatar-editor";

const EditProfile = async () => {
  const session = await getServerSession();
  if (!session?.user) return redirect("/login");

  const queryClient = getQueryClient();
  const userResult = await queryClient.fetchQuery(
    orpc.users.me.queryOptions({
      input: { username: session.user.username! },
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
          <FieldGroup className="flex flex-col items-center py-0 md:w-64 md:items-start md:pr-32">
            <FieldLabel className="h3-bold! text-nowrap">
              Profile picture
            </FieldLabel>
            <AvatarEditor user={user} />
          </FieldGroup>
        </FieldGroup>
      </FieldSet>
    </div>
  );
};

export default EditProfile;
