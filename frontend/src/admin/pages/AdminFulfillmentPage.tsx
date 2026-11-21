import React, { useState } from 'react';
import { Play, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { DataTable, Column } from '../components/DataTable';
import { StatusBadge } from '../components/StatusBadge';
import { QikinkDiagnosticResult } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

interface DispatchLog {
  id: string;
  orderNumber: string;
  qikinkOrderId: string;
  courier: string;
  trackingNumber: string;
  status: 'acknowledged' | 'printing' | 'shipped' | 'delivered';
  timestamp: string;
}

const DISPATCH_HISTORY: DispatchLog[] = [
  { id: '1', orderNumber: 'VYO-784912', qikinkOrderId: 'QIK-89124', courier: 'Delhivery Surface', trackingNumber: 'DELHIVERY-789123441', status: 'acknowledged', timestamp: '2026-11-21 14:35' },
  { id: '2', orderNumber: 'VYO-784911', qikinkOrderId: 'QIK-89125', courier: 'Delhivery Surface', trackingNumber: 'DELHIVERY-789123442', status: 'printing', timestamp: '2026-11-21 14:00' },
  { id: '3', orderNumber: 'VYO-784910', qikinkOrderId: 'QIK-89098', courier: 'BlueDart Express', trackingNumber: 'BLUEDART-55442211', status: 'shipped', timestamp: '2026-11-21 13:10' },
  { id: '4', orderNumber: 'VYO-784909', qikinkOrderId: 'QIK-88942', courier: 'Delhivery Surface', trackingNumber: 'DELHIVERY-99887766', status: 'delivered', timestamp: '2026-11-21 10:00' },
];

export const AdminFulfillmentPage: React.FC = () => {
  const [diagnosticResult, setDiagnosticResult] = useState<QikinkDiagnosticResult | null>(null);
  const [testing, setTesting] = useState<boolean>(false);

  const runSandboxDiagnostic = async () => {
    setTesting(true);
    const start = performance.now();

    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/orders/sandbox-test`, {
        method: 'POST',
      });
      const latencyMs = Math.round(performance.now() - start);
      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setDiagnosticResult({
          timestamp: new Date().toLocaleTimeString(),
          status: 'success',
          httpStatus: res.status,
          latencyMs,
          message: data.message || 'Qikink sandbox test order successfully dispatched and validated.',
          rawPayload: data,
        });
      } else {
        setDiagnosticResult({
          timestamp: new Date().toLocaleTimeString(),
          status: 'error',
          httpStatus: res.status,
          latencyMs,
          message: data.detail || 'Qikink API rejected simulated dispatch test.',
          rawPayload: data,
        });
      }
    } catch (err: any) {
      const latencyMs = Math.round(performance.now() - start);
      setDiagnosticResult({
        timestamp: new Date().toLocaleTimeString(),
        status: 'error',
        latencyMs,
        message: 'Network failure connecting to FastAPI orders sandbox endpoint.',
        rawPayload: { error: String(err) },
      });
    } finally {
      setTesting(false);
    }
  };

  const columns: Column<DispatchLog>[] = [
    {
      key: 'orderNumber',
      header: 'Order Reference',
      render: (d) => <span className="font-bold text-[#F4F0E8]">{d.orderNumber}</span>,
    },
    {
      key: 'qikinkOrderId',
      header: 'Qikink POD ID',
      render: (d) => <span className="text-[#A8A29E] font-medium">{d.qikinkOrderId}</span>,
    },
    {
      key: 'courier',
      header: 'Assigned Carrier',
      render: (d) => <span className="text-[#F4F0E8]">{d.courier}</span>,
    },
    {
      key: 'trackingNumber',
      header: 'AWB Waybill',
      render: (d) => <span className="text-xs text-[#C85A2E] font-semibold">{d.trackingNumber}</span>,
    },
    {
      key: 'status',
      header: 'Fulfillment State',
      render: (d) => <StatusBadge status={d.status} />,
    },
    {
      key: 'timestamp',
      header: 'Dispatch Time',
      align: 'right',
      render: (d) => <span className="text-[#716B63]">{d.timestamp}</span>,
    },
  ];

  return (
    <div className="space-y-6 font-montserrat">
      {/* Header */}
      <div>
        <span className="text-[10px] uppercase font-bold tracking-[0.24em] text-[#C85A2E] block mb-1">
          CARRIER INTEGRATION
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F4F0E8]">
          Fulfillment & Qikink POD Console<span className="text-[#C85A2E]">.</span>
        </h1>
        <p className="text-xs text-[#A8A29E] mt-1">
          Monitor automated print-on-demand dispatches, carrier AWB syncs, and sandbox health
        </p>
      </div>

      {/* Interactive POD Sandbox Diagnostics Card */}
      <div className="bg-[#141414] border border-[#242321] rounded-2xl p-6 sm:p-7 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-[#242321]">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#C85A2E]">
              LIVE DIAGNOSTICS
            </span>
            <h3 className="text-lg font-bold text-[#F4F0E8] mt-1">
              Qikink POD Sandbox Diagnostic Test
            </h3>
            <p className="text-xs text-[#716B63] mt-1">
              Sends an automated test payload to Qikink sandbox to verify API token authentication & schema validity
            </p>
          </div>

          <button
            onClick={runSandboxDiagnostic}
            disabled={testing}
            className="px-4 py-2.5 bg-[#C85A2E] hover:bg-[#a64720] disabled:opacity-50 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer shrink-0"
          >
            {testing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-white" />}
            <span>{testing ? 'Testing Sandbox...' : 'Run Sandbox Test'}</span>
          </button>
        </div>

        {/* Diagnostic Output Panel */}
        {diagnosticResult && (
          <div className="mt-5 p-4 bg-[#0B0B0B] border border-[#242321] rounded-xl text-xs space-y-3 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {diagnosticResult.status === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-[#86C286]" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-[#D47984]" />
                )}
                <span className={diagnosticResult.status === 'success' ? 'text-[#86C286] font-bold' : 'text-[#D47984] font-bold'}>
                  {diagnosticResult.message}
                </span>
              </div>
              <span className="text-[#716B63]">
                Latency: <span className="text-[#F4F0E8] font-bold">{diagnosticResult.latencyMs}ms</span> | {diagnosticResult.timestamp}
              </span>
            </div>

            {diagnosticResult.rawPayload && (
              <pre className="p-3 bg-[#141414] border border-[#242321] rounded-lg text-[11px] text-[#A8A29E] overflow-x-auto max-h-48 leading-relaxed font-mono">
                {JSON.stringify(diagnosticResult.rawPayload, null, 2)}
              </pre>
            )}
          </div>
        )}
      </div>

      {/* Dispatch History Table */}
      <DataTable
        columns={columns}
        data={DISPATCH_HISTORY}
        searchKey={(d) => `${d.orderNumber} ${d.qikinkOrderId} ${d.trackingNumber}`}
        searchPlaceholder="Filter dispatches by order or tracking number..."
      />
    </div>
  );
};
