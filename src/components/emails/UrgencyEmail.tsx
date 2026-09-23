import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface UrgencyEmailProps {
  userName?: string;
  hoursRemaining?: number;
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://mindinbox.com";

export default function UrgencyEmail({ userName = "أيها المستنير", hoursRemaining = 48 }: UrgencyEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>بصيرتك توشك على الانقطاع. لم يتبقَ سوى القليل.</Preview>
      <Body style={main}>
        <Container style={container}>
          
          <Section style={logoSection}>
            <Text style={logoText}>MIND IN A BOX</Text>
          </Section>

          <Heading style={heading} dir="rtl">
            تحذير من المجلس، {userName}
          </Heading>
          
          <Text style={paragraph} dir="rtl">
            بصيرتك توشك على الانقطاع. لم يتبقَ سوى <strong style={{ color: '#D4AF37' }}>{hoursRemaining} ساعة</strong> قبل أن تُوصد أبواب الحكمة وتعود للعامة.
          </Text>

          <Text style={paragraph} dir="rtl">
            هل أنت مستعد لفقدان ما اكتشفته؟ ارتقِ الآن للحفاظ على وصولك النخبوي والانضمام إلى المستنيرين.
          </Text>

          <Section style={btnContainer}>
            <Button style={button} href={`${baseUrl}/dashboard/billing`}>
              ارتقِ وحافظ على مقعدك
            </Button>
          </Section>

          <Hr style={hr} />
          
          <Text style={footer} dir="rtl">
            "لا قيمة للمعرفة إن لم تُحافظ عليها حين توشك على الضياع."
          </Text>
          <Text style={footerSignature}>
            المجلس السري — عقل في صندوق
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

// Luxurious Obsidian Black & Gold Styles (Red accents for urgency)
const main = {
  backgroundColor: "#050505",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "40px 20px",
  maxWidth: "600px",
  backgroundColor: "#050505",
  border: "1px solid rgba(255, 69, 58, 0.3)", // Subtle red border for urgency
  borderRadius: "4px",
};

const logoSection = {
  textAlign: "center" as const,
  marginBottom: "30px",
};

const logoText = {
  fontSize: "24px",
  fontWeight: "bold",
  color: "#D4AF37",
  letterSpacing: "8px",
  margin: "0",
};

const heading = {
  fontSize: "28px",
  lineHeight: "1.3",
  fontWeight: "700",
  color: "#FF453A", // Urgency Red
  textAlign: "center" as const,
  marginBottom: "24px",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "1.8",
  color: "#E5E5E5",
  textAlign: "right" as const,
  marginBottom: "20px",
};

const btnContainer = {
  textAlign: "center" as const,
  marginTop: "40px",
  marginBottom: "40px",
};

const button = {
  backgroundColor: "rgba(212, 175, 55, 0.1)",
  border: "1px solid #D4AF37",
  borderRadius: "2px",
  color: "#D4AF37",
  fontSize: "16px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "14px 28px",
  fontWeight: "bold",
  letterSpacing: "1px",
};

const hr = {
  borderColor: "rgba(255, 69, 58, 0.2)",
  margin: "40px 0",
};

const footer = {
  color: "#888888",
  fontSize: "14px",
  fontStyle: "italic",
  textAlign: "center" as const,
  marginBottom: "10px",
};

const footerSignature = {
  color: "rgba(212, 175, 55, 0.5)",
  fontSize: "12px",
  letterSpacing: "3px",
  textAlign: "center" as const,
  textTransform: "uppercase" as const,
};

