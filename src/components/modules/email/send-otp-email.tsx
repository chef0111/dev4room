import * as React from "react";
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Tailwind,
} from "@react-email/components";

interface SendOTPEmailProps {
  userEmail: string;
  otp: string;
  expiryMinutes: number;
}

const SendOTPEmail = (props: SendOTPEmailProps) => {
  const { userEmail, otp, expiryMinutes } = props;

  return (
    <Html lang="en" dir="ltr">
      <Tailwind>
        <Head />
        <Preview>Your verification code - {otp}</Preview>
        <Body className="bg-gray-100 py-[40px] font-sans">
          <Container className="mx-auto max-w-[580px] rounded-[8px] bg-white shadow-sm">
            {/* Logo Header */}
            <Section
              className="rounded-t-[8px] border-b-2 border-gray-200 py-[20px] text-center shadow-sm"
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
                        <td style={{ verticalAlign: "middle" }}>
                          <Text
                            className="m-0 text-[48px] font-bold text-white"
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
            <Section className="px-[48px] pt-[32px] text-center">
              <Heading className="m-0 text-[28px] font-bold text-black">
                Verify Your Account
              </Heading>
            </Section>

            {/* Main Content */}
            <Section className="px-[48px] pt-[20px] pb-[40px]">
              <Text className="text-[16px] leading-[24px] text-gray-800">
                Hello,
              </Text>

              <Text className="mb-[24px] text-[16px] leading-[24px] text-gray-800">
                We received a request to verify your account for{" "}
                <strong>{userEmail}</strong>.
              </Text>

              <Text className="mb-[32px] text-[16px] leading-[24px] text-gray-800">
                Please use the verification code below to complete your account
                setup. This code will expire in {expiryMinutes} minutes.
              </Text>

              {/* OTP Code Display with Integrated Copy Button */}
              <Section className="mb-[32px] text-center">
                <div
                  style={{
                    display: "inline-block",
                    background:
                      "linear-gradient(129deg, #0091ff 0%, #5faee2 100%)",
                    padding: "24px",
                    borderRadius: "12px",
                    border: "2px solid #e5e7eb",
                    position: "relative",
                  }}
                >
                  <table style={{ width: "100%" }}>
                    <tr>
                      <td
                        style={{ textAlign: "center", verticalAlign: "middle" }}
                      >
                        <Text
                          className="m-0 pl-[8px] text-[32px] font-bold tracking-[8px] text-white"
                          style={{
                            fontSize: "32px",
                            fontWeight: "bold",
                            color: "white",
                            margin: 0,
                            fontFamily: "monospace",
                          }}
                        >
                          {otp}
                        </Text>
                      </td>
                    </tr>
                  </table>
                </div>
              </Section>

              <Text className="mb-[24px] text-center text-[14px] leading-[20px] text-gray-600">
                Enter this code in the verification field to continue, or click
                the copy icon above.
              </Text>

              <Text className="mb-[16px] text-[14px] leading-[20px] text-gray-600">
                <strong>Security Notice:</strong> This verification code is
                valid for {expiryMinutes} minutes only. If you didn&apos;t
                request this verification, please ignore this email.
              </Text>

              <Text className="mb-[24px] text-[14px] leading-[20px] text-gray-600">
                For your security, never share this code with anyone. Our team
                will never ask you for this code via phone or email.
              </Text>

              <Text className="text-[14px] leading-[20px] text-gray-600">
                If you&apos;re having trouble with verification, please contact
                our support team for assistance.
              </Text>
            </Section>

            {/* Footer */}
            <Section className="rounded-b-[8px] border-t border-gray-200 bg-gray-50 px-[48px] py-[32px]">
              <Text className="m-0 mb-[8px] text-center text-[12px] leading-[16px] text-gray-500">
                This email was sent to {userEmail}
              </Text>

              <Text className="m-0 mb-[8px] text-center text-[12px] leading-[16px] text-gray-500">
                Dev4Room, Linh Xuan, Ho Chi Minh City, Vietnam
              </Text>

              <Text className="m-0 text-center text-[12px] leading-[16px] text-gray-500">
                © 2025 Dev4Room. All rights reserved.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default SendOTPEmail;
