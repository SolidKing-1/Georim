import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

const helpImage = require("../assets/help_banner.png"); // Replace with your image
const emailIcon = require("../assets/email-icon.png"); // Replace with your email icon
const faqIcon = require("../assets/conversation.png"); // Add this import

const FAQS = [
  {
    category: "Registration",
    question: "How do I create a new account?",
    answer:
      "To create a new account, tap 'Sign Up' on the login screen and fill in your details. You'll receive a confirmation email once registration is complete.",
  },
  {
    category: "Payments",
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit/debit cards, PayPal, and mobile money. You can select your preferred payment method during checkout.",
  },
  {
    category: "Check-in",
    question: "Can I change my check-in date?",
    answer:
      "Check-in dates are set by the event organizer. If you need to change your date, please contact support or the event admin directly.",
  },
  {
    category: "Registration",
    question: "How do I reset my password?",
    answer:
      "On the login screen, tap 'Forgot Password?' and follow the instructions to reset your password via email.",
  },
];

const FAQ_CATEGORIES = ["All", "Registration", "Payments", "Check-in"];

export default function HelpAndSupport() {
  const navigation = useNavigation();
  const [emailExpanded, setEmailExpanded] = useState(false);
  const [faqExpanded, setFaqExpanded] = useState(false);
  const [faqFilter, setFaqFilter] = useState("All");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const filteredFaqs =
    faqFilter === "All"
      ? FAQS
      : FAQS.filter((faq) => faq.category === faqFilter);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={26} color="#222" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help and Support</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Top Image */}
        <Image
          source={helpImage}
          style={styles.bannerImage}
          resizeMode="cover"
        />

        {/* Centered Help Text */}
        <Text style={styles.helpTitle}>How can we help you?</Text>
        <Text style={styles.helpSubtitle}>
          Find answers to common questions or contact our support team for
          assistance.
        </Text>
        <Text style={styles.helpSubtitle}>
          We're here to make your event experience seamless!
        </Text>

        {/* Email Admin Card */}
        <View style={styles.card}>
          <TouchableOpacity
            style={styles.cardHeader}
            onPress={() => setEmailExpanded((prev) => !prev)}
            activeOpacity={0.8}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image source={emailIcon} style={styles.cardIcon} />
              <View style={{ marginLeft: 12 }}>
                <Text style={styles.cardTitle}>Email Admin</Text>
                <Text style={styles.cardDesc}>
                  Reach out to georim admin for personalized support.
                </Text>
              </View>
            </View>
            <Icon
              name={emailExpanded ? "chevron-up" : "chevron-down"}
              size={22}
              color="#4f46e5"
            />
          </TouchableOpacity>
          {emailExpanded && (
            <View style={styles.cardBody}>
              <Text style={styles.cardBodyText}>
                You can email the admin for help with registration, payments, or
                event details.
              </Text>
              <TouchableOpacity
                style={styles.emailButton}
                onPress={() => {
                  // You can use Linking.openURL('mailto:admin@email.com') here
                }}
              >
                <Icon name="mail-outline" size={18} color="#fff" />
                <Text style={styles.emailButtonText}>Contact Admin</Text>
              </TouchableOpacity>
              <Text style={styles.cardBodyTextSmall}>
                Typical response time: within 24 hours.
              </Text>
            </View>
          )}
        </View>

        {/* FAQs Card */}
        <View style={styles.card}>
          <TouchableOpacity
            style={styles.cardHeader}
            onPress={() => setFaqExpanded((prev) => !prev)}
            activeOpacity={0.8}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image source={faqIcon} style={styles.cardIcon} />
              {/* Use your image here */}
              <View style={{ marginLeft: 12 }}>
                <Text style={styles.cardTitle}>FAQs</Text>
                <Text style={styles.cardDesc}>
                  Browse frequently asked questions and answers.
                </Text>
              </View>
            </View>
            <Icon
              name={faqExpanded ? "chevron-up" : "chevron-down"}
              size={22}
              color="#4f46e5"
            />
          </TouchableOpacity>
          {faqExpanded && (
            <View style={styles.cardBody}>
              {/* FAQ Filter Buttons */}
              <View style={styles.faqFilterRow}>
                {FAQ_CATEGORIES.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.faqFilterBtn,
                      faqFilter === cat && styles.faqFilterBtnActive,
                    ]}
                    onPress={() => {
                      setFaqFilter(cat);
                      setOpenFaqIndex(null);
                    }}
                  >
                    <Text
                      style={[
                        styles.faqFilterText,
                        faqFilter === cat && styles.faqFilterTextActive,
                      ]}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              {/* FAQ List */}
              {filteredFaqs.map((faq, idx) => (
                <View key={idx} style={styles.faqQuestionCard}>
                  <TouchableOpacity
                    style={styles.faqQuestionRow}
                    onPress={() =>
                      setOpenFaqIndex(openFaqIndex === idx ? null : idx)
                    }
                  >
                    <Text style={styles.faqQuestion}>{faq.question}</Text>
                    <Icon
                      name={
                        openFaqIndex === idx ? "chevron-up" : "chevron-forward"
                      }
                      size={20}
                      color="#4f46e5"
                    />
                  </TouchableOpacity>
                  {openFaqIndex === idx && (
                    <View style={styles.faqAnswerBox}>
                      <Text style={styles.faqAnswer}>{faq.answer}</Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#fff",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#222",
    marginLeft: 16,
  },
  bannerImage: {
    width: width,
    height: 240,
    marginBottom: 24,
  },
  helpTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#4f46e5",
    textAlign: "center",
    marginBottom: 6,
  },
  helpSubtitle: {
    fontSize: 15,
    color: "#555",
    textAlign: "center",
    marginBottom: 2,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    marginHorizontal: 18,
    marginTop: 18,
    padding: 0,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#eee",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 18,
  },
  cardIcon: {
    width: 30,
    height: 36,
    resizeMode: "contain",
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#222",
  },
  cardDesc: {
    fontSize: 13,
    color: "#666",
    marginTop: 2,
    maxWidth: width * 0.6,
  },
  cardBody: {
    paddingHorizontal: 18,
    paddingBottom: 16,
    paddingTop: 0,
  },
  cardBodyText: {
    fontSize: 13,
    color: "#444",
    marginBottom: 12,
  },
  cardBodyTextSmall: {
    fontSize: 12,
    color: "#888",
    marginTop: 8,
    marginBottom: 2,
  },
  emailButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4f46e5",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 18,
    alignSelf: "flex-start",
    marginTop: 6,
  },
  emailButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 12,
    marginLeft: 8,
  },
  faqFilterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  faqFilterBtn: {
    backgroundColor: "#f3f3f7",
    borderRadius: 20,
    paddingVertical: 7,
    paddingHorizontal: 10,
    marginRight: 6,
  },
  faqFilterBtnActive: {
    backgroundColor: "#4f46e5",
  },
  faqFilterText: {
    color: "#4f46e5",
    fontWeight: "600",
    fontSize: 14,
  },
  faqFilterTextActive: {
    color: "#fff",
  },
  faqQuestionCard: {
    backgroundColor: "#fafbff",
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#eee",
  },
  faqQuestionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  faqQuestion: {
    fontSize: 15,
    fontWeight: "600",
    color: "#222",
    flex: 1,
    marginRight: 10,
  },
  faqAnswerBox: {
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    padding: 14,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  faqAnswer: {
    fontSize: 14,
    color: "#444",
    lineHeight: 20,
  },
});
