import { DocumentStateSnapshot } from "@/features/editor/types";
import { SavedTemplateItem } from "../types";

export const INITIAL_TEMPLATE_DATA: DocumentStateSnapshot = {
  metadata: {
    companyName: "Your Company",
    companyTagline: "Better Documents, Better Business",
    documentTitle: "VISUAL DOCUMENT",
    issuerDetails: "Issuer Details",
    clientDetails: "Client Details",
    documentNumber: "C-2026-061",
    documentDate: "2026-09-14",
  },
  paperSize: "a4",
  pages: [
    {
      pageNumber: 1,
      layoutRows: [
        {
          id: "page-row-header",
          marginTop: 0,
          marginBottom: 8,
          paddingTop: 0,
          paddingBottom: 0,
          columns: [
            {
              id: "col-header-logo",
              width: 8,
              blocks: [
                {
                  id: "header-logo-1",
                  type: "image",
                  caption: "Company Logo",
                  isLogoPreset: true,
                  width: 42,
                  height: 42,
                  align: "left",
                  borderRadius: 8,
                },
              ],
            },
            {
              id: "col-header-company",
              width: 52,
              blocks: [
                {
                  id: "header-company-name",
                  type: "text",
                  content: "Your Company",
                  fontFamily: "Inter",
                  fontSize: 22,
                  fontWeight: "800",
                  color: "#0f172a",
                  align: "left",
                },
                {
                  id: "header-company-tagline",
                  type: "text",
                  content: "Better Documents, Better Business",
                  fontFamily: "Inter",
                  fontSize: 12,
                  fontWeight: "500",
                  color: "#64748b",
                  align: "left",
                },
              ],
            },
            {
              id: "col-header-title",
              width: 40,
              blocks: [
                {
                  id: "header-doc-title",
                  type: "text",
                  content: "VISUAL DOCUMENT",
                  fontFamily: "Inter",
                  fontSize: 22,
                  fontWeight: "900",
                  color: "#0f172a",
                  align: "right",
                },
              ],
            },
          ],
        },
        {
          id: "page-row-divider",
          marginTop: 0,
          marginBottom: 14,
          paddingTop: 0,
          paddingBottom: 0,
          columns: [
            {
              id: "col-divider-main",
              width: 100,
              blocks: [
                {
                  id: "header-divider-1",
                  type: "shape",
                  shapeType: "divider",
                  color: "#2563eb",
                  height: 1.5,
                },
              ],
            },
          ],
        },
        {
          id: "page-row-meta",
          marginTop: 0,
          marginBottom: 16,
          paddingTop: 0,
          paddingBottom: 0,
          columns: [
            {
              id: "col-meta-issuer",
              width: 33.3,
              blocks: [
                {
                  id: "meta-block-issuer",
                  type: "text",
                  content: "ISSUER/\nIssuer Details",
                  fontFamily: "Inter",
                  fontSize: 13,
                  fontWeight: "700",
                  color: "#0f172a",
                  align: "left",
                },
              ],
            },
            {
              id: "col-meta-client",
              width: 33.3,
              blocks: [
                {
                  id: "meta-block-client",
                  type: "text",
                  content: "Client Details",
                  fontFamily: "Inter",
                  fontSize: 13,
                  fontWeight: "700",
                  color: "#0f172a",
                  align: "left",
                },
              ],
            },
            {
              id: "col-meta-nodate",
              width: 33.4,
              blocks: [
                {
                  id: "meta-block-nodate",
                  type: "text",
                  content: "No/Date:  C-2026-061\n2026-09-14",
                  fontFamily: "Inter",
                  fontSize: 13,
                  fontWeight: "700",
                  color: "#0f172a",
                  align: "right",
                },
              ],
            },
          ],
        },
        {
          id: "page-row-table",
          marginTop: 0,
          marginBottom: 16,
          paddingTop: 0,
          paddingBottom: 0,
          columns: [
            {
              id: "col-table-main",
              width: 100,
              blocks: [
                {
                  id: "initial-table-1",
                  type: "table",
                  title: "QUOTATION ITEMS",
                  tableWidth: "100%",
                  borderStyle: "1px solid #E5E7EB",
                  padding: 8,
                  rowSpacing: 0,
                  rows: [
                    { id: 1, item: "Product A", qty: 2, unitPrice: "$10.00", amount: "$20.00" },
                    { id: 2, item: "Product B", qty: 3, unitPrice: "$10.00", amount: "$45.00" },
                    { id: 3, item: "Product B", qty: 1, unitPrice: "$15.00", amount: "$45.00" },
                    { id: 4, item: "Product C", qty: 1, unitPrice: "$50.00", amount: "$50.00" },
                    { id: 5, item: "Product D", qty: 5, unitPrice: "$8.00", amount: "$40.00" },
                  ],
                },
              ],
            },
          ],
        },
      ],
      blocks: [
        {
          id: "header-logo-1",
          type: "image",
          caption: "Company Logo",
          isLogoPreset: true,
          width: 42,
          height: 42,
          align: "left",
          borderRadius: 8,
        },
        {
          id: "header-company-name",
          type: "text",
          content: "Your Company",
          fontFamily: "Inter",
          fontSize: 22,
          fontWeight: "800",
          color: "#0f172a",
          align: "left",
        },
        {
          id: "header-company-tagline",
          type: "text",
          content: "Better Documents, Better Business",
          fontFamily: "Inter",
          fontSize: 12,
          fontWeight: "500",
          color: "#64748b",
          align: "left",
        },
        {
          id: "header-doc-title",
          type: "text",
          content: "VISUAL DOCUMENT",
          fontFamily: "Inter",
          fontSize: 22,
          fontWeight: "900",
          color: "#0f172a",
          align: "right",
        },
        {
          id: "header-divider-1",
          type: "shape",
          shapeType: "divider",
          color: "#2563eb",
          height: 1.5,
        },
        {
          id: "meta-block-issuer",
          type: "text",
          content: "ISSUER/\nIssuer Details",
          fontFamily: "Inter",
          fontSize: 13,
          fontWeight: "700",
          color: "#0f172a",
          align: "left",
        },
        {
          id: "meta-block-client",
          type: "text",
          content: "Client Details",
          fontFamily: "Inter",
          fontSize: 13,
          fontWeight: "700",
          color: "#0f172a",
          align: "left",
        },
        {
          id: "meta-block-nodate",
          type: "text",
          content: "No/Date:  C-2026-061\n2026-09-14",
          fontFamily: "Inter",
          fontSize: 13,
          fontWeight: "700",
          color: "#0f172a",
          align: "right",
        },
        {
          id: "initial-table-1",
          type: "table",
          title: "QUOTATION ITEMS",
          tableWidth: "100%",
          borderStyle: "1px solid #E5E7EB",
          padding: 8,
          rowSpacing: 0,
          rows: [
            { id: 1, item: "Product A", qty: 2, unitPrice: "$10.00", amount: "$20.00" },
            { id: 2, item: "Product B", qty: 3, unitPrice: "$10.00", amount: "$45.00" },
            { id: 3, item: "Product B", qty: 1, unitPrice: "$15.00", amount: "$45.00" },
            { id: 4, item: "Product C", qty: 1, unitPrice: "$50.00", amount: "$50.00" },
            { id: 5, item: "Product D", qty: 5, unitPrice: "$8.00", amount: "$40.00" },
          ],
        },
      ],
    },
  ],
};

export const DEFAULT_TEMPLATES_LIST: SavedTemplateItem[] = [
  {
    id: "template-1",
    name: "Template-1",
    savedAt: "2026-09-15 | 10:00 AM",
  },
];

export function getFormattedTemplateDate(date = new Date()): string {
  const formattedDate = `${date.toISOString().split("T")[0]} | ${date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
  return formattedDate;
}

export function getLocalStorageTemplateData(id: string): DocumentStateSnapshot {
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem(`doc_template_data_${id}`);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.pages && parsed.pages.length > 0) {
          const page1 = parsed.pages[0];
          const rows = page1.layoutRows || [];
          const hasHeaderRow = rows.some(
            (r: any) =>
              r.id === "page-row-header" ||
              r.columns?.some((c: any) => c.id === "col-header-company")
          );
          if (!hasHeaderRow && INITIAL_TEMPLATE_DATA.pages[0].layoutRows) {
            const updatedPage1 = {
              ...page1,
              layoutRows: [
                INITIAL_TEMPLATE_DATA.pages[0].layoutRows[0],
                INITIAL_TEMPLATE_DATA.pages[0].layoutRows[1],
                ...rows,
              ],
            };
            return {
              ...parsed,
              pages: [updatedPage1, ...parsed.pages.slice(1)],
            };
          }
        }
        return parsed;
      }
    } catch (e) {
      console.error("Failed to load template data from localStorage", e);
    }
  }
  return INITIAL_TEMPLATE_DATA;
}

export function setLocalStorageTemplateData(id: string, data: DocumentStateSnapshot): void {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(`doc_template_data_${id}`, JSON.stringify(data));
    } catch (e) {
      console.error("Failed to save template data to localStorage", e);
    }
  }
}

export function removeLocalStorageTemplateData(id: string): void {
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem(`doc_template_data_${id}`);
    } catch (e) {
      console.error("Failed to remove template data from localStorage", e);
    }
  }
}
