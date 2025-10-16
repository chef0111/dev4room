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
            <Section className="px-[48px] pt-[32px] text-center">
              <Heading className="text-black text-[28px] font-bold m-0">
                Verify Your Account
              </Heading>
            </Section>

            {/* Main Content */}
            <Section className="px-[48px] pt-[20px] pb-[40px]">
              <Text className="text-gray-800 text-[16px] leading-[24px]">
                Hello,
              </Text>

              <Text className="text-gray-800 text-[16px] leading-[24px] mb-[24px]">
                We received a request to verify your account for{" "}
                <strong>{userEmail}</strong>.
              </Text>

              <Text className="text-gray-800 text-[16px] leading-[24px] mb-[32px]">
                Please use the verification code below to complete your account
                setup. This code will expire in {expiryMinutes} minutes.
              </Text>

              {/* OTP Code Display with Integrated Copy Button */}
              <Section className="text-center mb-[32px]">
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
                          className="text-white text-[32px] pl-[8px] font-bold m-0 tracking-[8px]"
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

              <Text className="text-gray-600 text-[14px] leading-[20px] mb-[24px] text-center">
                Enter this code in the verification field to continue, or click
                the copy icon above.
              </Text>

              <Text className="text-gray-600 text-[14px] leading-[20px] mb-[16px]">
                <strong>Security Notice:</strong> This verification code is
                valid for {expiryMinutes} minutes only. If you didn&apos;t
                request this verification, please ignore this email.
              </Text>

              <Text className="text-gray-600 text-[14px] leading-[20px] mb-[24px]">
                For your security, never share this code with anyone. Our team
                will never ask you for this code via phone or email.
              </Text>

              <Text className="text-gray-600 text-[14px] leading-[20px]">
                If you&apos;re having trouble with verification, please contact
                our support team for assistance.
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

export default SendOTPEmail;
