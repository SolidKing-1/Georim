import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { View, Text, StyleSheet, TextInput, Pressable } from "react-native";
import {
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import PrimaryButton from "./PrimaryButton";

export type OrderSummaryModalRef = {
  present: () => void;
  dismiss: () => void;
};

type OrderSummaryModalProps = {
  ticketTierName?: string;
  ticketPrice?: string;
  ticketTierId?: string;
  eventId?: string;
  onClose?: () => void;
  onContinue?: (orderData: {
    quantity: number;
    subtotal: string;
    fees: string;
    total: string;
    promoCode: string;
  }) => void;
};

const OrderSummaryModal = forwardRef<
  OrderSummaryModalRef,
  OrderSummaryModalProps
>(function OrderSummaryModal(
  {
    ticketTierName = "Premium Guest",
    ticketPrice = "$10",
    ticketTierId,
    eventId,
    onClose,
    onContinue,
  },
  ref
) {
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [quantity, setQuantity] = useState(3);
  const [promoCode, setPromoCode] = useState("");

  useImperativeHandle(ref, () => ({
    present: () => bottomSheetRef.current?.present(),
    dismiss: () => bottomSheetRef.current?.dismiss(),
  }));

  const subtotal = (() => {
    const num = parseFloat((ticketPrice || "10").replace(/[^0-9.]/g, "")) || 10;
    return (num * quantity).toFixed(2);
  })();
  const fees = (parseFloat(subtotal) * 0.079).toFixed(2);
  const total = (parseFloat(subtotal) + parseFloat(fees)).toFixed(2);

  const handleContinue = () => {
    bottomSheetRef.current?.dismiss();
    onContinue?.({
      quantity,
      subtotal,
      fees,
      total,
      promoCode,
    });
  };

  const snapPoints = React.useMemo(() => ["60%"], []);
  const renderBackdrop = React.useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    []
  );

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      enablePanDownToClose
      onDismiss={onClose}
      backdropComponent={renderBackdrop}
      backgroundStyle={styles.sheetBackground}
      handleIndicatorStyle={styles.handleIndicator}
      handleStyle={styles.handleContainer}
    >
      <BottomSheetScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Order Summary</Text>

        <Text style={styles.ticketDescription}>
          Purchasing the{" "}
          <Text style={styles.ticketTierName}>{ticketTierName}</Text> Ticket
        </Text>
        <Text style={styles.disclaimer}>
          Tickets are transferable. Check out event refund policy
        </Text>

        {/* Number of ticket */}
        <View style={styles.quantityRow}>
          <Text style={styles.fieldLabelInRow}>Number of ticket</Text>
          <View style={styles.quantityControl}>
            <Pressable
              style={({ pressed }) => [
                styles.quantityButton,
                pressed && styles.quantityButtonPressed,
              ]}
              onPress={() => setQuantity((q) => Math.max(1, q - 1))}
            >
              <Text style={styles.quantityButtonText}>−</Text>
            </Pressable>
            <View style={styles.quantityValueWrap}>
              <Text style={styles.quantityValue}>{quantity}</Text>
            </View>
            <Pressable
              style={({ pressed }) => [
                styles.quantityButton,
                pressed && styles.quantityButtonPressed,
              ]}
              onPress={() => setQuantity((q) => q + 1)}
            >
              <Text style={styles.quantityButtonText}>+</Text>
            </Pressable>
          </View>
        </View>

        {/* Promotional Code */}
        <View style={styles.promoRow}>
          <Text style={styles.fieldLabelInRow}>Promotional Code</Text>
          <Pressable
            style={({ pressed }) => [
              styles.promoRemoveButton,
              pressed && styles.quantityButtonPressed,
            ]}
          >
            <Text style={styles.quantityButtonText}>−</Text>
          </Pressable>
        </View>

        {/* Price breakdown */}
        <View style={styles.priceBox}>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Subtotal</Text>
            <Text style={styles.priceValue}>${subtotal}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Fees & Taxes</Text>
            <Text style={styles.priceValue}>${fees}</Text>
          </View>
          <View style={styles.priceDivider} />
          <View style={styles.priceRow}>
            <Text style={styles.priceTotalLabel}>Total</Text>
            <Text style={styles.priceTotalValue}>${total}</Text>
          </View>
        </View>

        {/* Continue button */}
        <PrimaryButton title="Continue" onPress={handleContinue} />

        <View style={{ height: 32 }} />
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
});

export default OrderSummaryModal;

const styles = StyleSheet.create({
  sheetBackground: {
    backgroundColor: "#05031B",
  },
  handleContainer: {
    paddingTop: 12,
  },
  handleIndicator: {
    backgroundColor: "rgba(255,255,255,0.4)",
    width: 40,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "500",
    color: "#FFFFFF",
    marginBottom: 12,
  },
  ticketDescription: {
    fontSize: 15,
    color: "#8F8E9B",
    marginBottom: 6,
  },
  ticketTierName: {
    color: "#932FF8",
    fontWeight: "600",
  },
  disclaimer: {
    fontSize: 13,
    color: "#8F8E9B",
    marginBottom: 20,
    lineHeight: 18,
  },
  fieldLabel: {
    fontSize: 18,
    fontWeight: "400",
    color: "#8F8E9B",
    marginBottom: 8,
  },
  fieldLabelInRow: {
    fontSize: 16,
    fontWeight: "400",
    color: "#8F8E9B",
  },
  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#05031B",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#131245",
    paddingHorizontal: 16,
    marginBottom: 16,
    height: 52,
  },
  quantityControl: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#37375B",
    borderRadius: 999,
    overflow: "hidden",
    height: 33,
  },
  quantityButton: {
    width: 20,
    height: 27,
    alignItems: "center",
    justifyContent: "center",
  },
  quantityButtonPressed: {
    opacity: 0.8,
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  quantityValueWrap: {
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  quantityValue: {
    fontSize: 16,
    fontWeight: "500",
    color: "#FFFFFF",
  },
  promoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#0E0D32",
    borderRadius: 20,
    paddingHorizontal: 16,
    marginBottom: 12,
    height: 58,
  },
  promoInput: {
    flex: 1,
    fontSize: 15,
    color: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  promoRemoveButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  priceBox: {
    backgroundColor: "#05031B",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#131245",
    padding: 16,
    marginBottom: 24,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: 15,
    color: "#8F8E9B",
  },
  priceValue: {
    fontSize: 15,
    color: "#FFFFFF",
    fontWeight: "500",
  },
  priceDivider: {
    height: 1,
    backgroundColor: "#131245",
    marginVertical: 10,
  },
  priceTotalLabel: {
    fontSize: 17,
    fontWeight: "500",
    color: "#8F8E9B",
  },
  priceTotalValue: {
    fontSize: 16,
    fontWeight: "500",
    color: "#FFFFFF",
  },
});
