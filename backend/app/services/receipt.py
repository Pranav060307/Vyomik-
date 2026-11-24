"""
Official VYOMIK PDF Receipt Generation Engine.
Produces high-resolution, vector-crisp payment receipts using ReportLab.
Adheres strictly to the brand's luxury streetwear editorial typography and integer Paise pricing.
"""

import io
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    HRFlowable,
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm


def generate_vyomik_pdf_receipt(receipt_data: Dict[str, Any]) -> bytes:
    """
    Generates a production-ready, beautifully typeset PDF receipt for verified UPI transactions.
    
    receipt_data structure:
    {
        "receipt_number": "VYREC-20261123-8942",
        "order_number": "VY2611ABC12",
        "date_str": "23 November 2026, 09:38 PM IST",
        "customer_name": "Aarav Sharma",
        "customer_email": "aarav@vyomik.com",
        "customer_upi_id": "vibhav@fam",
        "receiving_vpa": "vyomik@okhdfcbank",
        "utr_number": "630155807241",
        "amount_paise": 249900,
        "items": [
            {"title": "Core Hoodie — Ivory", "color": "Ivory", "size": "M", "qty": 1, "price_paise": 249900}
        ],
        "pricing": {
            "subtotal_paise": 249900,
            "shipping_fee_paise": 0,
            "total_paise": 249900
        }
    }
    """
    buffer = io.BytesIO()

    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        leftMargin=20 * mm,
        rightMargin=20 * mm,
        topMargin=20 * mm,
        bottomMargin=20 * mm,
    )

    styles = getSampleStyleSheet()

    # Brand color palette
    c_black = colors.HexColor("#0B0B0B")
    c_charcoal = colors.HexColor("#242321")
    c_rust = colors.HexColor("#A64B2A")
    c_orange = colors.HexColor("#C85A2E")
    c_ivory = colors.HexColor("#F4F0E8")
    c_grey = colors.HexColor("#716B63")
    c_light_bg = colors.HexColor("#F9F8F6")
    c_border = colors.HexColor("#E5E0D8")
    c_green = colors.HexColor("#2B7A4B")

    # Typography Styles
    style_brand = ParagraphStyle(
        "BrandHeader",
        fontName="Helvetica-Bold",
        fontSize=24,
        leading=28,
        textColor=c_black,
        spaceAfter=2,
    )
    style_tagline = ParagraphStyle(
        "BrandTagline",
        fontName="Helvetica",
        fontSize=9,
        leading=12,
        textColor=c_grey,
        spaceAfter=15,
    )
    style_receipt_title = ParagraphStyle(
        "ReceiptTitle",
        fontName="Helvetica-Bold",
        fontSize=14,
        leading=18,
        alignment=2,  # Right aligned
        textColor=c_orange,
    )
    style_receipt_subtitle = ParagraphStyle(
        "ReceiptSubtitle",
        fontName="Helvetica",
        fontSize=9,
        leading=13,
        alignment=2,  # Right aligned
        textColor=c_grey,
    )
    style_label = ParagraphStyle(
        "FieldLabel",
        fontName="Helvetica-Bold",
        fontSize=8,
        leading=10,
        textColor=c_grey,
    )
    style_value = ParagraphStyle(
        "FieldValue",
        fontName="Helvetica",
        fontSize=9.5,
        leading=13,
        textColor=c_black,
    )
    style_value_bold = ParagraphStyle(
        "FieldValueBold",
        fontName="Helvetica-Bold",
        fontSize=10,
        leading=13,
        textColor=c_black,
    )
    style_paid_badge = ParagraphStyle(
        "PaidBadge",
        fontName="Helvetica-Bold",
        fontSize=10,
        leading=12,
        alignment=1,
        textColor=colors.white,
    )
    style_table_header = ParagraphStyle(
        "TableHeader",
        fontName="Helvetica-Bold",
        fontSize=8.5,
        leading=11,
        textColor=c_black,
    )
    style_table_cell = ParagraphStyle(
        "TableCell",
        fontName="Helvetica",
        fontSize=8.5,
        leading=12,
        textColor=c_black,
    )
    style_table_cell_right = ParagraphStyle(
        "TableCellRight",
        fontName="Helvetica",
        fontSize=8.5,
        leading=12,
        alignment=2,
        textColor=c_black,
    )
    style_table_cell_bold_right = ParagraphStyle(
        "TableCellBoldRight",
        fontName="Helvetica-Bold",
        fontSize=10,
        leading=13,
        alignment=2,
        textColor=c_orange,
    )
    style_footer = ParagraphStyle(
        "FooterNote",
        fontName="Helvetica",
        fontSize=7.5,
        leading=10,
        alignment=1,
        textColor=c_grey,
    )

    story = []

    # 1. Header Grid (Brand on Left, Receipt Info on Right)
    header_table_data = [
        [
            Paragraph("<b>VYOMIK</b>", style_brand),
            Paragraph("OFFICIAL PAYMENT RECEIPT", style_receipt_title),
        ],
        [
            Paragraph("STREETWEAR & MODERN APPAREL", style_tagline),
            Paragraph(f"Receipt No: <b>{receipt_data.get('receipt_number', 'N/A')}</b>", style_receipt_subtitle),
        ],
    ]
    t_header = Table(header_table_data, colWidths=[90 * mm, 80 * mm])
    t_header.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('LEFTPADDING', (0, 0), (-1, -1), 0),
        ('RIGHTPADDING', (0, 0), (-1, -1), 0),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 0),
        ('TOPPADDING', (0, 0), (-1, -1), 0),
    ]))
    story.append(t_header)

    story.append(HRFlowable(width="100%", thickness=1, color=c_border, spaceBefore=10, spaceAfter=15))

    # 2. Payment & Verification Proof Grid
    utr_val = receipt_data.get("utr_number") or "N/A"
    cust_upi = receipt_data.get("customer_upi_id") or "N/A"
    recv_vpa = receipt_data.get("receiving_vpa") or "vyomik@okhdfcbank"
    date_val = receipt_data.get("date_str") or datetime.now(timezone.utc).strftime("%d %B %Y, %I:%M %p")

    proof_table_data = [
        [
            Paragraph("CUSTOMER INFORMATION", style_label),
            Paragraph("TRANSACTION & VERIFICATION EVIDENCE", style_label),
        ],
        [
            Paragraph(f"<b>{receipt_data.get('customer_name', 'Valued Customer')}</b><br/>{receipt_data.get('customer_email', '')}", style_value),
            Paragraph(f"Bank UTR: <b>{utr_val}</b><br/>Payer UPI: <b>{cust_upi}</b>", style_value),
        ],
        [
            Paragraph("ORDER IDENTIFIER", style_label),
            Paragraph("PAYMENT DESTINATION & DATE", style_label),
        ],
        [
            Paragraph(f"Order #{receipt_data.get('order_number', 'N/A')}", style_value_bold),
            Paragraph(f"Recipient: {recv_vpa}<br/>Verified on: {date_val}", style_value),
        ],
    ]
    t_proof = Table(proof_table_data, colWidths=[85 * mm, 85 * mm])
    t_proof.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), c_light_bg),
        ('BOX', (0, 0), (-1, -1), 0.5, c_border),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, c_border),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('LEFTPADDING', (0, 0), (-1, -1), 10),
        ('RIGHTPADDING', (0, 0), (-1, -1), 10),
    ]))
    story.append(t_proof)

    story.append(Spacer(1, 15))

    # 3. Itemized Products Table
    items_table_data = [
        [
            Paragraph("ITEM / DESCRIPTION", style_table_header),
            Paragraph("VARIANT", style_table_header),
            Paragraph("QTY", style_table_header),
            Paragraph("UNIT PRICE", style_table_header),
            Paragraph("AMOUNT", style_table_header),
        ]
    ]

    items = receipt_data.get("items") or []
    if not items:
        # Fallback default item if none provided
        items = [{"title": "VYOMIK Apparel Collection", "color": "Standard", "size": "Universal", "qty": 1, "price_paise": receipt_data.get("amount_paise", 0)}]

    for itm in items:
        desc = itm.get("title") or itm.get("name") or "VYOMIK Apparel"
        variant = f"{itm.get('color', '')} / {itm.get('size', '')}".strip(" /")
        qty = str(itm.get("qty", 1))
        unit_paise = itm.get("price_paise", 0)
        tot_item_paise = unit_paise * itm.get("qty", 1)
        
        items_table_data.append([
            Paragraph(desc, style_table_cell),
            Paragraph(variant, style_table_cell),
            Paragraph(qty, style_table_cell),
            Paragraph(f"Rs. {unit_paise / 100:,.2f}", style_table_cell_right),
            Paragraph(f"Rs. {tot_item_paise / 100:,.2f}", style_table_cell_right),
        ])

    pricing = receipt_data.get("pricing") or {}
    subtotal_paise = pricing.get("subtotal_paise", receipt_data.get("amount_paise", 0))
    shipping_paise = pricing.get("shipping_fee_paise", 0)
    grand_total_paise = pricing.get("total_paise", receipt_data.get("amount_paise", 0))

    # Subtotals and Grand Total
    items_table_data.append([
        "", "", "",
        Paragraph("Subtotal:", style_table_cell_right),
        Paragraph(f"Rs. {subtotal_paise / 100:,.2f}", style_table_cell_right),
    ])
    items_table_data.append([
        "", "", "",
        Paragraph("Shipping:", style_table_cell_right),
        Paragraph("FREE" if shipping_paise == 0 else f"Rs. {shipping_paise / 100:,.2f}", style_table_cell_right),
    ])
    items_table_data.append([
        "", "", "",
        Paragraph("<b>Total Paid:</b>", style_table_cell_bold_right),
        Paragraph(f"<b>Rs. {grand_total_paise / 100:,.2f}</b>", style_table_cell_bold_right),
    ])

    t_items = Table(
        items_table_data,
        colWidths=[70 * mm, 30 * mm, 15 * mm, 25 * mm, 30 * mm],
    )
    t_items.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), c_light_bg),
        ('LINEBELOW', (0, 0), (-1, 0), 1, c_black),
        ('LINEBELOW', (0, 1), (-1, -4), 0.5, c_border),
        ('LINEABOVE', (3, -3), (4, -1), 0.5, c_border),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
    ]))
    story.append(t_items)

    story.append(Spacer(1, 20))

    # 4. Status Watermark Card
    status_table_data = [
        [
            Paragraph("<b>PAYMENT STATUS: COMPLETED & VERIFIED VIA AUTOMATIC HDFC BANK RECONCILIATION</b>", style_paid_badge)
        ]
    ]
    t_status = Table(status_table_data, colWidths=[170 * mm])
    t_status.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), c_green),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('LEFTPADDING', (0, 0), (-1, -1), 10),
        ('RIGHTPADDING', (0, 0), (-1, -1), 10),
    ]))
    story.append(t_status)

    story.append(Spacer(1, 20))

    # 5. Footer Notes
    story.append(Paragraph(
        "This official electronic receipt is issued by VYOMIK for the specified order. "
        "Payment was executed via the Unified Payments Interface (UPI) and confirmed via automatic bank transaction reference matching.<br/>"
        "Customer Support: smiplyvyomik@vyomik.co | Official Portal: vyomik.com",
        style_footer,
    ))

    doc.build(story)
    pdf_bytes = buffer.getvalue()
    buffer.close()
    return pdf_bytes
