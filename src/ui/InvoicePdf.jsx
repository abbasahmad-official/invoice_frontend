import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 11,
    color: "#222",
    padding: 35,
    backgroundColor: "#fff",
  },

  // HEADER
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#999",
    paddingBottom: 8,
    marginBottom: 10,
  },
  companyInfo: {
    width: "60%",
  },
  companyName: { fontSize: 16, fontWeight: "bold", marginBottom: 2 },
  companyDetails: { fontSize: 10, color: "#555", lineHeight: 1.3 },

  invoiceTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "right",
    marginBottom: 5,
  },
  invoiceDetails: {
    fontSize: 10,
    color: "#555",
    textAlign: "right",
  },

  // BILL TO + SHIP TO
  addressSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 12,
  },
  addressBlock: {
    width: "48%",
  },
  addressTitle: {
    fontWeight: "bold",
    marginBottom: 3,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingBottom: 2,
  },
  addressLine: { fontSize: 10, color: "#333", lineHeight: 1.4 },

  // TABLE
  table: {
    width: "100%",
    borderWidth: 0.8,
    borderColor: "#ccc",
    borderBottomWidth: 0,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f2f2f2",
    borderBottomWidth: 0.8,
    borderColor: "#ccc",
    fontWeight: "bold",
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 0.6,
    borderColor: "#e0e0e0",
  },
  tableColProduct: { flex: 3, padding: 6 },
  tableColQty: { flex: 1, padding: 6, textAlign: "center" },
  tableColPrice: { flex: 1, padding: 6, textAlign: "right" },
  tableColTotal: { flex: 1, padding: 6, textAlign: "right" },
  tableHeaderText: { fontSize: 10, fontWeight: "bold" },
  tableText: { fontSize: 10 },

  // SUMMARY
  summarySection: {
    marginTop: 12,
    alignItems: "flex-end",
  },
  summaryTable: {
    width: "50%",
    borderWidth: 0.8,
    borderColor: "#ccc",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 0.6,
    borderColor: "#e0e0e0",
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  summaryLabel: { fontSize: 10, color: "#333" },
  summaryValue: { fontSize: 10 },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    paddingHorizontal: 8,
    backgroundColor: "#f2f2f2",
  },
  totalLabel: { fontWeight: "bold", fontSize: 11 },
  totalValue: { fontWeight: "bold", fontSize: 11 },

  // FOOTER
  footer: {
    marginTop: 30,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    paddingTop: 10,
    textAlign: "center",
    fontSize: 10,
    color: "#666",
  },
});

const InvoicePDF = ({ seeInvoice }) => {
  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const calcSummary = (items = [], tax = 0, discount = 0) => {
    const subtotal = items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    const taxAmount = (tax / 100) * subtotal;
    const discountAmount = (discount / 100) * subtotal;
    const total = subtotal + taxAmount - discountAmount;
    return { subtotal, taxAmount, discountAmount, total };
  };

  const { subtotal, taxAmount, discountAmount, total } = calcSummary(
    seeInvoice?.items,
    seeInvoice?.tax,
    seeInvoice?.discount
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.companyInfo}>
            <Text style={styles.companyName}>
              {seeInvoice.organization?.name || "Your Company Name"}
            </Text>
            <Text style={styles.companyDetails}>
              Street Address, City, State ZIP
            </Text>
            <Text style={styles.companyDetails}>Phone: +92 300 0000000</Text>
            <Text style={styles.companyDetails}>Email: info@company.com</Text>
          </View>
          <View>
            <Text style={styles.invoiceTitle}>SALES INVOICE</Text>
            <Text style={styles.invoiceDetails}>
              DATE: {formatDate(seeInvoice.createdAt)}
            </Text>
            <Text style={styles.invoiceDetails}>
              INVOICE #: {seeInvoice.invoiceNumber}
            </Text>
          </View>
        </View>

        {/* BILL TO / SHIP TO */}
        <View style={styles.addressSection}>
          <View style={styles.addressBlock}>
            <Text style={styles.addressTitle}>BILL TO:</Text>
            <Text style={styles.addressLine}>{seeInvoice.client?.name}</Text>
            <Text style={styles.addressLine}>{seeInvoice.client?.email}</Text>
            <Text style={styles.addressLine}>{seeInvoice.client?.phone}</Text>
          </View>

          <View style={styles.addressBlock}>
            <Text style={styles.addressTitle}>SHIP TO:</Text>
            <Text style={styles.addressLine}>
              {seeInvoice.client?.address || "N/A"}
            </Text>
          </View>
        </View>

        {/* TABLE */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableColProduct, styles.tableHeaderText]}>
              Description
            </Text>
            <Text style={[styles.tableColQty, styles.tableHeaderText]}>
              Qty
            </Text>
            <Text style={[styles.tableColPrice, styles.tableHeaderText]}>
              Price
            </Text>
            <Text style={[styles.tableColTotal, styles.tableHeaderText]}>
              Line Total
            </Text>
          </View>

          {seeInvoice.items?.map((item, i) => (
            <View key={i} style={styles.tableRow}>
              <Text style={[styles.tableColProduct, styles.tableText]}>
                {item.productId?.name}
              </Text>
              <Text style={[styles.tableColQty, styles.tableText]}>
                {item.quantity}
              </Text>
              <Text style={[styles.tableColPrice, styles.tableText]}>
                Rs {item.price.toFixed(2)}
              </Text>
              <Text style={[styles.tableColTotal, styles.tableText]}>
                Rs {(item.price * item.quantity).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>

        {/* SUMMARY */}
        <View style={styles.summarySection}>
          <View style={styles.summaryTable}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>Rs {subtotal.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tax ({seeInvoice.tax}%)</Text>
              <Text style={styles.summaryValue}>Rs {taxAmount.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>
                Discount ({seeInvoice.discount}%)
              </Text>
              <Text style={styles.summaryValue}>
                Rs {discountAmount.toFixed(2)}
              </Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>TOTAL DUE</Text>
              <Text style={styles.totalValue}>Rs {total.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* FOOTER */}
        <View style={styles.footer}>
          <Text>Thank you for your business!</Text>
          <Text>This is a computer-generated invoice.</Text>
        </View>
      </Page>
    </Document>
  );
};

export default InvoicePDF;
