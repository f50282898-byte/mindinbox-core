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

interface WelcomeEmailProps {
  userName?: string;
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://mindinbox.com";

export default function WelcomeEmail({ userName = "أيها المستنير" }: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>مرحباً بك في رحلة الوعي. لقد فتحت باباً لا يجرؤ الكثيرون على الاقتراب منه.</Preview>
      <Body style={main}>
        <Container style={container}>
          
          <Section style={logoSection}>
            {/* Elegant text logo fallback if image doesn't load */}
            <Text style={logoText}>MIND IN A BOX</Text>
          </Section>

          <Heading style={heading} dir="rtl">
            مرحباً بك في رحلة الوعي، {userName}.
          </Heading>
          
          <Text style={paragraph} dir="rtl">
            لقد فتحت باباً لا يجرؤ الكثيرون على الاقتراب منه. 
            أنت الآن في الملاذ الآمن للنخبة، حيث يتلاقى الذكاء الاصطناعي مع أعظم الفلسفات البشرية.
          </Text>

          <Text style={paragraph} dir="rtl">
            أمامك 14 يوماً لتثبت أنك أهلٌ لهذه الحكمة. استكشف، تأمل، وواجه ذاتك.
          </Text>

          <Section style={btnContainer}>
            <Button style={button} href={`${baseUrl}/dashboard/tracker`}>
              ادخل إلى مرآة العقل
            </Button>
          </Section>

          <Hr style={hr} />
          
          <Text style={footer} dir="rtl">
            تذكر: المعرفة الحقيقية تبدأ عندما تدرك حجم جهلك المطلق.
          </Text>
          <Text style={footerSignature}>
            المجلس السري — عقل في صندوق
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

// Luxurious Obsidian Black & Gold Styles
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
  border: "1px solid rgba(212, 175, 55, 0.2)",
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
  color: "#D4AF37",
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
  backgroundColor: "#050505",
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
  borderColor: "rgba(212, 175, 55, 0.2)",
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

