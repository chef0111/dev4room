import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Dev4Room - Programming Q&A Community";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0F172A",
        backgroundImage:
          "radial-gradient(circle at 25px 25px, #1E293B 2%, transparent 0%), radial-gradient(circle at 75px 75px, #1E293B 2%, transparent 0%)",
        backgroundSize: "100px 100px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "24px",
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "16px",
              background: "linear-gradient(135deg, #FF7000 0%, #E2995F 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontSize: "48px",
                fontWeight: "bold",
                color: "white",
              }}
            >
              D4
            </span>
          </div>
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: "72px",
            fontWeight: "bold",
            color: "white",
            margin: 0,
            textAlign: "center",
          }}
        >
          Dev4Room
        </h1>

        {/* Tagline */}
        <p
          style={{
            fontSize: "32px",
            color: "#94A3B8",
            margin: 0,
            textAlign: "center",
            maxWidth: "800px",
          }}
        >
          Programming Q&A community, built for developers
        </p>

        {/* Features */}
        <div
          style={{
            display: "flex",
            gap: "32px",
            marginTop: "24px",
          }}
        >
          {["Ask Questions", "Share Knowledge", "Grow Together"].map(
            (feature) => (
              <div
                key={feature}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "12px 24px",
                  borderRadius: "9999px",
                  backgroundColor: "rgba(255, 112, 0, 0.2)",
                  border: "1px solid rgba(255, 112, 0, 0.3)",
                }}
              >
                <span
                  style={{
                    fontSize: "20px",
                    color: "#FF7000",
                    fontWeight: "500",
                  }}
                >
                  {feature}
                </span>
              </div>
            )
          )}
        </div>
      </div>

      {/* URL */}
      <p
        style={{
          position: "absolute",
          bottom: "40px",
          fontSize: "24px",
          color: "#64748B",
        }}
      >
        dev4room.pro
      </p>
    </div>,
    {
      ...size,
    }
  );
}
