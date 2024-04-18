from io import BytesIO
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle


def draw_pdf_invoice(order):
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter)
    elements = []
    data = [["Product name", "Quantity", "Price"]]

    for item in order.items.all():
        data.append([item.product.name, str(item.quantity), str(item.product.price)])

    # Add row for bonuses and paid status
    data.append(["", "", ""])
    data.append(["Bonuses:", "", f"{order.total_bonuses_amount}$"])
    data.append(["Paid:", "", "Yes" if order.payment_info.is_paid else "No"])

    style = TableStyle(
        [
            ("BACKGROUND", (0, 0), (-1, 0), colors.grey),
            ("TEXTCOLOR", (0, 0), (-1, 0), colors.whitesmoke),
            ("ALIGN", (0, 0), (-1, -1), "CENTER"),
            ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
            ("FONTSIZE", (0, 0), (-1, 0), 12),
            ("BOTTOMPADDING", (0, 0), (-1, 0), 12),
            ("BACKGROUND", (0, 1), (-1, -1), colors.beige),
        ]
    )

    table = Table(data)
    table.setStyle(style)

    elements.append(table)

    doc.build(elements)
    buffer.seek(0)
    invoice = buffer.getvalue()
    buffer.close()

    return invoice
