// ============================================================================
// CUSTOM SIZE CHART DIALOG
// ============================================================================

import { cn } from "@/utils/helpers";
import { Minus, Plus, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { CustomSizeChart, SizeChartRow } from "../../../types/variations.types";

interface CustomSizeChartDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (chart: CustomSizeChart) => void;
  onDelete?: (chartName: string) => void;
  existingChart: CustomSizeChart | null;
}

const INITIAL_CHART: SizeChartRow[] = [
  {
    sizeName: "XS",
    values: {
      CHEST: "34",
      SHOULDER: "16",
      OUTSEAM: "38",
      WAIST: "28",
    },
  },
  {
    sizeName: "S",
    values: {
      CHEST: "36",
      SHOULDER: "17",
      OUTSEAM: "39",
      WAIST: "30",
    },
  },
  {
    sizeName: "M",
    values: {
      CHEST: "38",
      SHOULDER: "18",
      OUTSEAM: "40",
      WAIST: "32",
    },
  },
  {
    sizeName: "L",
    values: {
      CHEST: "40",
      SHOULDER: "19",
      OUTSEAM: "41",
      WAIST: "34",
    },
  },
  {
    sizeName: "XL",
    values: {
      CHEST: "42",
      SHOULDER: "20",
      OUTSEAM: "42",
      WAIST: "36",
    },
  },
  {
    sizeName: "XXL",
    values: {
      CHEST: "44",
      SHOULDER: "21",
      OUTSEAM: "43",
      WAIST: "38",
    },
  },
];

const CustomSizeChartDialog = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  existingChart,
}: CustomSizeChartDialogProps) => {
  const [chartName, setChartName] = useState("");
  const [unit, setUnit] = useState("inch");
  const [columns, setColumns] = useState(["CHEST", "SHOULDER", "OUTSEAM", "WAIST"]);
  const [rows, setRows] = useState<SizeChartRow[]>(INITIAL_CHART);

  useEffect(() => {
    if (isOpen && existingChart) {
      setChartName(existingChart.chartName);
      setUnit(existingChart.unit || "inch");
      setColumns(existingChart.columns);
      setRows(existingChart.rows);
    } else if (isOpen && !existingChart) {
      setChartName("");
      setUnit("inch");
      setColumns(["CHEST", "SHOULDER", "OUTSEAM", "WAIST"]);
      setRows(INITIAL_CHART);
    }
  }, [isOpen, existingChart]);

  if (!isOpen) return null;

  const addColumn = () => {
    const newCol = `COLUMN_${columns.length + 1}`;
    setColumns([...columns, newCol]);
    setRows(rows.map((row) => ({ ...row, values: { ...row.values, [newCol]: "" } })));
  };

  const removeColumn = (colIndex: number) => {
    if (columns.length <= 1) return;
    const colToRemove = columns[colIndex];
    setColumns(columns.filter((_, i) => i !== colIndex));
    setRows(
      rows.map((row) => {
        const newValues = { ...row.values };
        delete newValues[colToRemove];
        return { ...row, values: newValues };
      })
    );
  };

  const addRow = () => {
    const newRow = { sizeName: "", values: {} as Record<string, string> };
    columns.forEach((col) => (newRow.values[col] = ""));
    setRows([...rows, newRow]);
  };

  const removeRow = (rowIndex: number) => {
    if (rows.length <= 1) return;
    setRows(rows.filter((_, i) => i !== rowIndex));
  };

  const updateSizeName = (rowIndex: number, value: string) => {
    const newRows = [...rows];
    newRows[rowIndex].sizeName = value;
    setRows(newRows);
  };

  const updateCellValue = (rowIndex: number, column: string, value: string) => {
    const newRows = [...rows];
    newRows[rowIndex].values[column] = value;
    setRows(newRows);
  };

  const updateColumnName = (colIndex: number, newName: string) => {
    const oldName = columns[colIndex];
    const newColumns = [...columns];
    newColumns[colIndex] = newName.toUpperCase();
    setColumns(newColumns);

    setRows(
      rows.map((row) => {
        const newValues: Record<string, string> = {};
        Object.keys(row.values).forEach((key) => {
          newValues[key === oldName ? newName.toUpperCase() : key] = row.values[key];
        });
        return { ...row, values: newValues };
      })
    );
  };

  const handleSave = () => {
    if (!chartName.trim()) {
      alert("Please enter a chart name");
      return;
    }

    const sizeObjects = rows.map((row) => ({
      name: row.sizeName,
      ...row.values,
    }));

    onSave({
      chartName: chartName.trim(),
      unit,
      columns,
      rows,
      sizeObjects,
    });
    onClose();
  };

  const handleDelete = () => {
    if (onDelete && existingChart) {
      if (confirm(`Are you sure you want to delete the chart "${existingChart.chartName}"?`)) {
        onDelete(existingChart.chartName);
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-base-1 rounded-2xl p-4 md:p-6 max-w-5xl w-full shadow-xl my-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg md:text-xl font-semibold text-body-content">
            {existingChart ? "Edit Size Chart" : "Custom Size Chart"}
          </h3>
          <button onClick={onClose} className="text-body-content hover:text-primary transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="mb-6 flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-body-content mb-2">Chart Name</label>
            <input
              type="text"
              value={chartName}
              onChange={(e) => setChartName(e.target.value)}
              className="w-full px-3 py-2 bg-base-2 border border-input-border rounded-lg text-body-content focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g. Mens Summer Collection"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setUnit("inch")}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                unit === "inch" ? "bg-base-2 text-body-content" : "bg-primary text-white"
              )}
            >
              inch
            </button>
            <button
              onClick={() => setUnit("cm")}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                unit === "cm" ? "bg-base-2 text-body-content" : "bg-primary text-white"
              )}
            >
              cm
            </button>
          </div>
        </div>

        <div className="overflow-x-auto mb-6">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-input-border">
                <th className="text-left p-3 text-sm font-semibold text-body-content">SIZE NAME</th>
                {columns.map((col, idx) => (
                  <th key={idx} className="text-left p-3 text-sm font-semibold text-body-content">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={col}
                        onChange={(e) => updateColumnName(idx, e.target.value)}
                        className="bg-transparent border-none text-body-content focus:outline-none w-24"
                      />
                      {columns.length > 1 && (
                        <button onClick={() => removeColumn(idx)} className="text-error hover:text-error/80">
                          <Minus size={16} />
                        </button>
                      )}
                    </div>
                  </th>
                ))}
                <th className="p-3 w-12">
                  <button onClick={addColumn} className="text-primary hover:text-primary/80">
                    <Plus size={20} />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIdx) => (
                <tr key={rowIdx} className="border-b border-input-border/50">
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => removeRow(rowIdx)}
                        className="text-error hover:text-error/80"
                        disabled={rows.length <= 1}
                      >
                        <Minus size={16} />
                      </button>
                      <input
                        type="text"
                        value={row.sizeName}
                        onChange={(e) => updateSizeName(rowIdx, e.target.value)}
                        className="px-3 py-2 bg-base-2 border border-input-border rounded-lg text-body-content focus:outline-none focus:ring-2 focus:ring-primary w-20"
                      />
                    </div>
                  </td>
                  {columns.map((col, colIdx) => (
                    <td key={colIdx} className="p-3">
                      <input
                        type="text"
                        value={row.values[col] || ""}
                        onChange={(e) => updateCellValue(rowIdx, col, e.target.value)}
                        className="px-3 py-2 bg-base-2 border border-input-border rounded-lg text-body-content focus:outline-none focus:ring-2 focus:ring-primary w-full"
                      />
                    </td>
                  ))}
                  <td></td>
                </tr>
              ))}
              <tr>
                <td colSpan={columns.length + 2} className="p-3">
                  <button
                    onClick={addRow}
                    className="flex items-center gap-2 text-primary hover:text-primary/80 text-sm font-medium"
                  >
                    <Plus size={16} /> Add Row
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="flex justify-between gap-3">
          <div>
            {existingChart && (
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 px-4 py-2 text-error border border-error/20 rounded-lg hover:bg-error/10 transition-colors"
              >
                <Trash2 size={16} /> Delete Chart
              </button>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-input-border rounded-lg text-body-content hover:bg-base-2 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              {existingChart ? "Update" : "Create"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomSizeChartDialog;
