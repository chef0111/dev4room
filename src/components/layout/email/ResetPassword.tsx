import * as React from "react";
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Text,
  Tailwind,
} from "@react-email/components";

interface ForgotPasswordEmailProps {
  username: string;
  userEmail: string;
  resetUrl: string;
}

const ForgotPasswordEmail = (props: ForgotPasswordEmailProps) => {
  const { username, userEmail, resetUrl } = props;

  return (
    <Html lang="en" dir="ltr">
      <Tailwind>
        <Head />
        <Preview>Reset your password - Action required</Preview>
        <Body className="bg-gray-100 font-sans py-[40px]">
          <Container className="bg-white rounded-[8px] shadow-sm max-w-[580px] mx-auto">
            {/* Logo Header */}
            <Section
              className="rounded-t-[8px] py-[20px] text-center border-b-2 border-gray-200 shadow-sm"
              style={{ backgroundColor: "#0f1117" }}
            >
              <table style={{ width: "100%", textAlign: "center" }}>
                <tr>
                  <td style={{ textAlign: "center", paddingBottom: "16px" }}>
                    <table
                      style={{
                        display: "inline-table",
                        verticalAlign: "middle",
                      }}
                    >
                      <tr>
                        <td
                          style={{
                            verticalAlign: "middle",
                            paddingRight: "12px",
                          }}
                        >
                          <Img
                            src="https://res.cloudinary.com/dpuqj2n2q/image/upload/v1759942491/brand_drlnde.png"
                            width={48}
                            height={48}
                            alt="DevFlow logo"
                          />
                        </td>
                        <td style={{ verticalAlign: "middle" }}>
                          <Text
                            className="text-[48px] font-bold text-white m-0"
                            style={{
                              fontSize: "48px",
                              fontWeight: "bold",
                              color: "white",
                              margin: 0,
                              lineHeight: "1",
                            }}
                          >
                            Dev<span style={{ color: "#0091ff" }}>4Room</span>
                          </Text>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </Section>

            {/* Title Section */}
            <Section className="px-[48px] py-[32px] text-center">
              <Heading className="text-black text-[28px] font-bold m-0">
                Password Reset Request
              </Heading>
            </Section>

            {/* Main Content */}
            <Section className="px-[48px] py-[20px]">
              <Text className="text-gray-800 text-[16px] leading-[24px] mb-[24px]">
                Hello, {username}
              </Text>

              <Text className="text-gray-800 text-[16px] leading-[24px] mb-[24px]">
                We received a request to reset the password for your account
                associated with <strong>{userEmail}</strong>.
              </Text>

              <Text className="text-gray-800 text-[16px] leading-[24px] mb-[32px]">
                Click the button below to create a new password. This link will
                expire in 24 hours for security reasons.
              </Text>

              {/* Reset Button */}
              <Section className="text-center mb-[32px]">
                <Button
                  href={resetUrl}
                  className="text-white px-[32px] py-[16px] rounded-[8px] text-[16px] font-semibold no-underline box-border inline-block"
                  style={{
                    background:
                      "linear-gradient(129deg, #0091ff 0%, #5faee2 100%)",
                  }}
                >
                  Reset Password
                </Button>
              </Section>

              <Text className="text-gray-600 text-[14px] leading-[20px] mb-[24px]">
                If the button above doesn&apos;t work, copy and paste this link
                into your browser:
              </Text>

              <Text className="text-blue-600 text-[14px] leading-[20px] mb-[32px] break-all">
                {resetUrl}
              </Text>

              <Text className="text-gray-600 text-[14px] leading-[20px] mb-[16px]">
                <strong>Didn&apos;t request this?</strong> If you didn&apos;t
                request a password reset, you can safely ignore this email. Your
                password will remain unchanged.
              </Text>

              <Text className="text-gray-600 text-[14px] leading-[20px]">
                For security reasons, this link will expire in 24 hours.
              </Text>
            </Section>

            {/* Footer */}
            <Section className="bg-gray-50 px-[48px] py-[32px] rounded-b-[8px] border-t border-gray-200">
              <Text className="text-gray-500 text-[12px] leading-[16px] text-center m-0 mb-[8px]">
                This email was sent to {userEmail}
              </Text>

              <Text className="text-gray-500 text-[12px] leading-[16px] text-center m-0 mb-[8px]">
                Dev4Room, Linh Xuan, Ho Chi Minh City, Vietnam
              </Text>

              <Text className="text-gray-500 text-[12px] leading-[16px] text-center m-0">
                © 2025 Dev4Room. All rights reserved.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default ForgotPasswordEmail;
