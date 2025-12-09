import { Route } from "next";
import Image from "next/image";
import Link from "next/link";

interface ProfileLinkProps {
  icon: string;
  href?: Route;
  title: string;
}

const ProfileLink = ({ icon, href, title }: ProfileLinkProps) => {
  return (
    <div className="flex-center gap-1">
      <Image src={icon} alt={title} width={20} height={20} />

      {href ? (
        <Link
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="pg-medium text-link-100 hover:text-primary-500 transition-colors"
        >
          {title}
        </Link>
      ) : (
        <p className="pg-medium text-dark400_light700">{title}</p>
      )}
    </div>
  );
};

export default ProfileLink;
