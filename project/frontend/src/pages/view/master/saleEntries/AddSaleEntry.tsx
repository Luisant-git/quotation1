import React, { useState, useEffect, useRef } from "react";
import {
  TextField,
  Button,
  Grid,
  Paper,
  CircularProgress,
  Autocomplete,
} from "@mui/material";
import {
  getSaleEntry,
  postSaleEntry,
  updateSaleEntry,
} from "../../../../api/saleentry";
import EditCell from "./EditCell";
import { toast } from "react-toastify";
import {
  getBillNo, 
  getTodayDate,
  printSaleEntry, 
} from "../../../../utils/common";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import { getCustomers } from "../../../../api/customer";

// Initial state for the sale entry form
const initialSaleEntry = {
  BillDate: getTodayDate(),
  Remarks: "",
  TotalAmount: 0,
  TotalPaidAmount: 0,
  CardAmount: 0,
  UPIAmount: 0,
  customername: "",
  Mobile: "",
  BillNo: "",
  RefNo: Math.floor(Math.random() * 1000000).toString(),
};

const AddSaleEntry = ({ isnew = false }) => {
  const [saleEntry, setSaleEntry] = useState(initialSaleEntry);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const firstInputRef = useRef<HTMLInputElement>(null);
  const [rows, setRows] = useState<any>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalQty, setTotalQty] = useState(0);
  const [isNetAmount, setIsNetAmount] = useState(false);
  const [customers, setCustomers] = useState<
    { customername: string; Mobile: string }[]
  >([]);
  const { id } = useParams();
  const navigate = useNavigate();

  const checkNetAmount = (rows: any[]) => {
    const hasZeroNetAmount = rows.some(
      (row) => parseFloat(row.netAmount || "0") === 0
    );
    return hasZeroNetAmount;
  };

  // This effect will run whenever 'rows' changes
  useEffect(() => {
    setIsNetAmount(checkNetAmount(rows));
    console.log("Net amount check result:", isNetAmount);
  }, [rows]);

  useEffect(() => {
    const fetchCustomers = async () => {
      const response = await getCustomers();
      if (response && Array.isArray(response.data)) {
        setCustomers(response.data);
      }
    };
    fetchCustomers();
  }, []);

  const fetchBillNo = async () => {
    const billNo = await getBillNo();
    setSaleEntry((prev) => ({
      ...prev,
      BillNo: prev.BillNo || billNo,
    }));
  };

  useEffect(() => {
    fetchBillNo();
  }, []);

  useEffect(() => {
    if (!isnew && id) {
      getSaleData();
    }
  }, [isnew, id]);

  const getSaleData = () => {
    setLoading(true);
    getSaleEntry(id)
      .then((response) => {
        if (response) {
          setSaleEntry(response?.data?.data);
          console.log("@@@@SALE ENTRY DATA FOR EDIT@@@", response?.data?.data);
          const mappedRows =
            response?.data?.data?.saleItems?.map((item: any) => ({
              id: item.id,
              itemid: item.Item_Id,
              itemCode: item.ItemMaster?.itemCode,
              itemName: item.ItemMaster?.itemName,
              category: item.ItemMaster?.category,
              color: item.ItemMaster?.color,
              size: item.ItemMaster?.size,
              hsnCode: item?.HSNCode,
              gstPercent: item?.DiscPercent,
              qty: item?.Qty,
              mrp: item?.MRP,
              saleRate: item?.Rate,
              discType: item?.DiscType,
              diskPersentage: item?.DiscPercent,
              discAmount: item?.DiscAmount,
              taxableAmount: item?.Amount,
              gstAmount: item?.GSTAmount,
              netAmount: item?.NetAmount,
            })) || [];

          setRows(mappedRows);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error("Error fetching sale data:", error);
        toast.error("Error fetching sale data", { autoClose: 3000 });
        setLoading(false);
      });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSaleEntry((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (print: boolean = false) => {
    setLoading(true);
    try {
      const payload = {
        ...saleEntry,
        id: undefined,
        TotalAmount: parseFloat(totalAmount.toString()) || 0,
        TotalPaidAmount: parseFloat(saleEntry.TotalPaidAmount.toString()) || 0,
        CardAmount: parseFloat(saleEntry.CardAmount.toString()) || 0,
        UPIAmount: parseFloat(saleEntry.UPIAmount.toString()) || 0,
        CreatedDate: new Date().toISOString(),
        TotalQty: parseFloat(totalQty.toString()),
        saleItems: rows.map((row: any) => ({
          ...(isnew ? {} : { id: row.id }),
          Item_Id: row.itemid,
          HSNCode: row.hsnCode,
          DiscPercent: parseFloat(row.gstPercent.toString()),
          Qty: parseFloat(row.qty.toString()),
          MRP: parseFloat(row.mrp.toString()),
          Rate: parseFloat(row.saleRate.toString()),
          DiscType: row.discType,
          DiscAmount: parseFloat(row.discAmount.toString()),
          GSTAmount: parseFloat(row.gstAmount.toString()),
          NetAmount: parseFloat(row.netAmount.toString()),
          Amount: parseFloat(row.netAmount.toString()),
        })),
      };

      console.log("Payload to save sale entry:", payload);

      const response = isnew
        ? await postSaleEntry(payload)
        : await updateSaleEntry(id, payload);

      if (response.success) {
        setSaleEntry(initialSaleEntry);
        setRows([]);
        setTotalAmount(0);
        setTotalQty(0);
        toast.success("Sale Entry Saved Successfully", { autoClose: 1000 });
        if (print) {
          printSaleEntry(response?.data);
          console.log("Printing sale entry:", response?.data);
          
        }
        navigate("/sale-entries");
      }
      // else {
      //   toast.error("Error saving sale entry", { autoClose: 1000 });
      // }
    } catch (error: any) {
      console.error("Error saving sale entry:", error);
      const backendMsg =
        error?.response?.data?.error || "Error saving sale entry";
      toast.error(backendMsg, { autoClose: 5000 });
    } finally {
      setLoading(false);
      setOpenModal(false);
    }
  };

  const [isReady, setIsReady] = React.useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsReady(true);
    }, 100);
  }, []);

  return (
    <Paper style={{ padding: 10 }}>
      <Grid container spacing={2}>
        {/* Bill No */}
        <Grid item xs={12} sm={3}>
          <TextField
            label="Bill No"
            name="BillNo"
            type="text"
            size="small"
            value={saleEntry.BillNo}
            onChange={handleInputChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
            inputRef={firstInputRef}
          />
        </Grid>

        {/* Bill Date */}
        <Grid item xs={12} sm={3}>
          <TextField
            label="Bill Date"
            name="billDate"
            type="date"
            size="small"
            value={saleEntry.BillDate}
            onChange={handleInputChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
            inputRef={firstInputRef}
          />
        </Grid>

        {/* Mobile No */}
        <Grid item xs={12} sm={3}>
          <TextField
            label="Mobile No"
            name="Mobile"
            type="number"
            size="small"
            value={saleEntry.Mobile}
            onChange={(e) => {
              const mobile = e.target.value;
              setSaleEntry((prev) => ({
                ...prev,
                Mobile: mobile,
                customername:
                  customers.find((c) => c.Mobile === mobile)?.customername ||
                  prev.customername,
              }));
            }}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        {/* Customer */}
        <Grid
          item
          xs={12}
          sm={3}
          style={{ display: "flex", alignItems: "center", gap: 8 }}
        >
          <TextField
            label="Customer"
            name="customername"
            size="small"
            fullWidth
            value={saleEntry.customername}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
      </Grid>

      {/* EditCell Component for Rows */}
      <div style={{ width: "100%", marginTop: 16 }}>
        <EditCell
          rows={rows}
          setRows={setRows}
          isReady={isReady}
          handleInputChange={handleInputChange}
          saleEntry={saleEntry}
          setTotalAmount={setTotalAmount}
          setTotalQty={setTotalQty}
        />
      </div>
      {/* Submit Button */}
      <div style={{ marginTop: 16 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenModal(true)}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Submit"}
        </Button>
      </div>

      {/* Confirmation Modal */}
      <div
        className={`modal fade ${openModal ? "show d-block" : ""}`}
        tabIndex={-1}
        style={{ background: "rgba(0, 0, 0, 0.5)" }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Sale Finalize</h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={() => setOpenModal(false)}
              ></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="color" className="form-label">
                  Total Payable
                </label>
                <input
                  type="text"
                  disabled
                  className="form-control"
                  id="Dia"
                  name="Dia"
                  value={totalAmount || 0}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="color" className="form-label">
                  Total Qty
                </label>
                <input
                  disabled
                  type="text"
                  className="form-control"
                  id="totalQty"
                  name="totalQty"
                  value={totalQty || ""}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="color" className="form-label">
                  Total Paid in Cash
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="totalPaidCash"
                  name="TotalPaidAmount"
                  value={saleEntry.TotalPaidAmount || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="color" className="form-label">
                  Total Paid in Card
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="cardAmount"
                  name="CardAmount"
                  value={saleEntry.CardAmount || 0}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="color" className="form-label">
                  Total Paid in Upi (Google Pay, PhonePe, etc.)
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="upiAmount"
                  name="UPIAmount"
                  value={saleEntry.UPIAmount || 0}
                  onChange={handleInputChange}
                />
              </div>
              <input
                disabled
                name="barcode"
                placeholder="Scan/Search product by barcode"
                className="form-control border-2 border-primary text-white italic fs-5 fw-2 mb-3"
                style={{ height: "50px", backgroundColor: "green" }}
                value={`Balance Amount : ₹ ${
                  totalAmount -
                  (saleEntry.TotalPaidAmount || 0) -
                  (saleEntry.CardAmount || 0) -
                  parseFloat(saleEntry.UPIAmount.toString() || "0")
                }`}
              />
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setOpenModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() =>
                  isNetAmount
                    ? toast.error("Please Enter RATE")
                    : handleSubmit()
                }
              >
                Save
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() =>
                  isNetAmount
                    ? toast.error("Please Enter RATE")
                    : handleSubmit(true)
                }
              >
                Save & Print
              </button>
            </div>
          </div>
        </div>
      </div>
    </Paper>
  );
};

export default AddSaleEntry;
