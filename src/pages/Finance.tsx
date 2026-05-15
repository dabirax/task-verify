import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { 
  Wallet, 
  TrendingUp, 
  ShieldCheck, 
  ArrowUpRight, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Landmark,
  PieChart as PieChartIcon,
  HelpCircle,
  BadgeCheck,
  Briefcase,
  Star,
  Lock,
} from 'lucide-react'
import { formatNaira } from '../utils/formatters'
import { FullPageLoader } from '../components/SkeletonLoader'
import { useApp } from '../context/AppContext'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Progress } from '../components/ui/progress'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { useWorkerProfile, useWorkerCreditScore } from '../hooks/useWorkerProfileQueries'
import { useWallet, useWalletTransactions, useGenerateVirtualAccount, useRequestWithdrawal } from '../hooks/useWallet'
import { useAuth } from '../hooks/useAuth'
import LoanModal from '../components/LoanModal'
import InsuranceModal from '../components/InsuranceModal'
import KYCModal from '../components/KYCModal'
import { DisputesSection } from '../components/DisputesSection'

const earningsMock = [
  { month: 'Jul', earnings: 18000 }, { month: 'Aug', earnings: 22000 },
  { month: 'Sep', earnings: 19500 }, { month: 'Oct', earnings: 28000 },
  { month: 'Nov', earnings: 31000 }, { month: 'Dec', earnings: 32000 },
]

const riskColors: Record<string, { bg: string; text: string; bar: string; iconColor: string }> = {
  low: { bg: 'bg-emerald-50', text: 'text-emerald-700', bar: 'bg-emerald-500', iconColor: 'text-emerald-500' },
  medium: { bg: 'bg-yellow-50', text: 'text-yellow-700', bar: 'bg-yellow-500', iconColor: 'text-yellow-500' },
  high: { bg: 'bg-red-50', text: 'text-red-700', bar: 'bg-red-500', iconColor: 'text-red-500' },
}

function CreditGauge({ score }: { score: number }) {
  const pct = Math.min(score / 850, 1)
  const color = score >= 700 ? '#10B981' : score >= 580 ? '#F59E0B' : '#EF4444'
  const label = score >= 750 ? 'Excellent' : score >= 700 ? 'Good' : score >= 580 ? 'Fair' : 'Poor'

  return (
    <div className="relative w-48 h-28 mx-auto">
      <svg viewBox="0 0 200 120" className="w-full h-full">
        <path d="M 20 110 A 80 80 0 0 1 180 110" fill="none" stroke="#e2e8f0" strokeWidth="14" strokeLinecap="round" />
        <motion.path
          d="M 20 110 A 80 80 0 0 1 180 110" fill="none" stroke={color} strokeWidth="14" strokeLinecap="round"
          strokeDasharray={`${pct * 251} 251`}
          initial={{ strokeDasharray: '0 251' }}
          animate={{ strokeDasharray: `${pct * 251} 251` }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
        <text x="100" y="100" textAnchor="middle" className="text-3xl font-black fill-navy-900">{score}</text>
        <text x="100" y="116" textAnchor="middle" className="text-[10px] font-black uppercase tracking-widest" fill={color}>{label}</text>
      </svg>
    </div>
  )
}

export default function Finance() {
  const { addToast } = useApp()
  const { user } = useAuth()
  
  const isWorker = user?.role === 'worker'
  const isEmployer = user?.role === 'buyer' || user?.role === 'employer'

  const { data: workerProfile, isLoading: loadingProfile } = useWorkerProfile({ enabled: isWorker })
  const { data: creditProfile, isLoading: loadingCredit } = useWorkerCreditScore({ enabled: isWorker })
  const { data: wallet, isLoading: loadingWallet } = useWallet()
  const { data: transactions, isLoading: loadingTransactions } = useWalletTransactions()
  const generateVAMutation = useGenerateVirtualAccount()
  const withdrawMutation = useRequestWithdrawal()

  const [showLoan, setShowLoan] = useState(false)
  const [showInsurance, setShowInsurance] = useState(false)
  const [showKYC, setShowKYC] = useState(false)

  const isLoading = (isWorker && (loadingProfile || loadingCredit)) || loadingWallet || loadingTransactions

  // Fallback data
  const creditScore = workerProfile?.financial_profile?.credit_score ?? workerProfile?.credit_score ?? creditProfile?.credit_score ?? user?.trust_score ?? 724
  const loanEligible = workerProfile?.financial_profile?.loan_eligibility ?? creditProfile?.loan_eligible ?? true
  const recommendedLoan = workerProfile?.financial_profile?.recommended_loan ?? 150000
  const riskLevel = workerProfile?.economic_profile?.risk_level ?? 'low'
  const risk = riskColors[riskLevel] ?? riskColors.low
  const walletBalance = workerProfile?.current_month_earnings ?? 0
  const totalEarnings = workerProfile?.total_earnings ?? 0
  const onTimeRate = workerProfile?.on_time_rate ?? 0

  if (isLoading) return <FullPageLoader />

  return (
    <>
      <div className="pt-24 pb-20 bg-slate-50 min-h-screen">
      <div className="page-container">
        {/* Page Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-black text-navy-900 tracking-tight leading-tight mb-2">
            {isWorker ? 'Finance & Trust Hub' : 'Wallet & Billing'}
          </h1>
          <p className="text-slate-400 text-sm font-medium">
            {isWorker 
              ? 'Manage your earnings, build trust score, and access financial opportunities.' 
              : 'Manage your platform funds, escrow transactions, and billing history.'}
          </p>
        </div>

        {isEmployer ? (
          <div className="space-y-8">
            <div className="grid lg:grid-cols-3 gap-8">
              <Card className="lg:col-span-2 border-none shadow-2xl shadow-navy-100/50 rounded-[2.5rem] p-1 bg-gradient-to-br from-navy-900 to-blue-900 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
                  <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(#ffffff_2px,transparent_2px)] [background-size:24px_24px]" />
                </div>
                <CardContent className="p-8 relative z-10 flex flex-col justify-between h-full min-h-[240px]">
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center gap-2 text-blue-200">
                        <Wallet className="w-5 h-5" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Available Balance</span>
                      </div>
                      <Badge className="bg-emerald-500/20 text-emerald-300 border-none px-3 py-1 text-[10px] uppercase font-black">Active</Badge>
                    </div>
                    <div className="text-5xl font-black mb-2">{formatNaira(Number(wallet?.balance || 0))}</div>
                    <div className="text-xs font-medium text-blue-200">Available to fund tasks and escrow</div>
                  </div>
                  <div className="flex gap-4 mt-8">
                    {!wallet?.squad_va_number ? (
                      <Button 
                        onClick={() => generateVAMutation.mutate()}
                        disabled={generateVAMutation.isPending}
                        className="bg-emerald-500 hover:bg-emerald-400 text-white font-black text-xs uppercase tracking-widest px-6 h-12 rounded-xl"
                      >
                        {generateVAMutation.isPending ? 'Generating...' : 'Generate Funding Account'}
                      </Button>
                    ) : (
                      <div className="bg-white/10 rounded-xl p-4 flex-1 backdrop-blur-sm border border-white/10">
                        <div className="text-[10px] text-blue-200 font-black uppercase tracking-widest mb-1">Fund Wallet via Transfer</div>
                        <div className="flex items-center gap-4">
                          <div className="text-xl font-black">{wallet.squad_va_number}</div>
                          <div className="text-xs font-bold px-3 py-1 rounded-full bg-white/20">{wallet.squad_bank_code || 'GTB'}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="lg:col-span-1 border-none shadow-2xl shadow-navy-100/50 rounded-[2.5rem] bg-white">
                <CardHeader className="px-8 pt-8 pb-4">
                  <CardTitle className="font-black text-navy-900 text-lg tracking-tight">Escrow Summary</CardTitle>
                </CardHeader>
                <CardContent className="px-8 pb-8 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center">
                      <Lock className="w-5 h-5 text-navy-900" />
                    </div>
                    <div>
                      <div className="text-2xl font-black text-navy-900">{formatNaira(Number(wallet?.locked_balance || 0))}</div>
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Currently in Escrow</div>
                    </div>
                  </div>
                  <Progress value={45} className="h-1.5 bg-slate-100" />
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    Funds are securely held in escrow until you approve the completed task.
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="border-none shadow-2xl shadow-navy-100/50 rounded-[2.5rem] bg-white">
              <CardHeader className="px-8 pt-8 pb-4 border-b border-slate-50">
                <CardTitle className="font-black text-navy-900 text-xl tracking-tight flex items-center gap-3">
                  <Clock className="w-5 h-5 text-blue-500" /> Recent Transactions
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {!transactions || transactions.length === 0 ? (
                  <div className="p-12 text-center text-slate-400">
                    <Wallet className="w-8 h-8 mx-auto mb-3 opacity-20" />
                    <p className="text-sm font-bold">No transactions found</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-50">
                    {transactions.map(t => (
                      <div key={t.id} className="flex items-center justify-between p-6 px-8 hover:bg-slate-50/50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            t.transaction_type === 'deposit' ? 'bg-emerald-50 text-emerald-600' : 
                            t.transaction_type === 'escrow_hold' ? 'bg-amber-50 text-amber-600' :
                            t.transaction_type === 'escrow_release' ? 'bg-blue-50 text-blue-600' :
                            'bg-slate-50 text-slate-600'
                          }`}>
                            {t.transaction_type === 'deposit' ? <ArrowUpRight className="w-4 h-4" /> : 
                             t.transaction_type === 'escrow_hold' ? <Lock className="w-4 h-4" /> :
                             <CheckCircle2 className="w-4 h-4" />}
                          </div>
                          <div>
                            <div className="text-sm font-black text-navy-900 mb-1">{t.description}</div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                              {new Date(t.created_at).toLocaleDateString()} · {t.transaction_type?.replace('_', ' ') || 'transaction'}
                            </div>
                          </div>
                        </div>
                        <div className={`text-sm font-black ${
                          t.transaction_type === 'deposit' ? 'text-emerald-600' : 
                          t.transaction_type === 'escrow_hold' ? 'text-navy-900' :
                          'text-navy-900'
                        }`}>
                          {t.transaction_type === 'deposit' ? '+' : '-'}{formatNaira(t.amount)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="space-y-8">
          <div className="grid lg:grid-cols-3 gap-8">
              {/* Credit Score Card */}
              <Card className="lg:col-span-1 border-none shadow-2xl shadow-navy-100/50 rounded-[2.5rem] p-8 bg-white flex flex-col items-center">
                <div className="text-center mb-8">
                  <h2 className="font-black text-navy-900 text-xl tracking-tight">National Trust Score</h2>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">AI-Driven Financial Reputation</p>
                </div>
                
                <CreditGauge score={creditScore} />
                
                <div className="w-full space-y-5 mt-10">
                  {[
                    { label: 'Work Consistency', pct: 94, icon: Clock },
                    { label: 'Payment Velocity', pct: 98, icon: TrendingUp },
                    { label: 'Dispute-Free Rate', pct: 100, icon: ShieldCheck },
                    { label: 'Income Growth', pct: 88, icon: ArrowUpRight },
                  ].map((factor) => (
                    <div key={factor.label} className="space-y-2">
                      <div className="flex justify-between items-center px-1">
                        <div className="flex items-center gap-2">
                          <factor.icon className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-[10px] font-black text-navy-900 uppercase tracking-wider">{factor.label}</span>
                        </div>
                        <span className="text-xs font-black text-emerald-600">{factor.pct}%</span>
                      </div>
                      <Progress value={factor.pct} className="h-1.5 bg-slate-100" />
                    </div>
                  ))}
                </div>
                
                <Button variant="ghost" className="mt-8 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-navy-900 gap-2">
                  Learn how it's calculated <HelpCircle className="w-4 h-4" />
                </Button>
              </Card>

              {/* Main Dashboard Column */}
              <div className="lg:col-span-2 flex flex-col gap-8">
                {/* Top Stat Row */}
                <div className="grid sm:grid-cols-3 gap-6">
                  {/* Wallet */}
                  <Card className="border-none bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-[2rem] p-6 shadow-xl shadow-emerald-100 relative overflow-hidden group">
                    <Wallet className="absolute -right-4 -bottom-4 w-24 h-24 text-white/10 group-hover:scale-110 transition-transform" />
                    <div className="relative z-10">
                      <div className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-2">Available Balance</div>
                      <div className="text-3xl font-black mb-1">{formatNaira(Number(wallet?.balance ?? walletBalance))}</div>
                      <div className="text-[10px] font-bold opacity-70">Secured via Squad Rails</div>
                      <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
                        <div className="flex flex-col text-[10px] font-bold">
                          <span>Total Earnings</span>
                          <span>{formatNaira(totalEarnings)}</span>
                        </div>
                        <Button 
                          onClick={() => {
                            const amount = window.prompt("Enter amount to withdraw:");
                            if (amount && !isNaN(Number(amount))) {
                               withdrawMutation.mutate({
                                 amount: Number(amount),
                                 bankCode: '058', // Defaulting to GTB
                                 bankAccountNumber: '0123456789',
                                 bankName: 'Guaranty Trust Bank'
                               }, {
                                 onSuccess: () => {
                                   addToast("Withdrawal request submitted for processing", "success");
                                 },
                                 onError: (err: any) => {
                                   addToast(err.message || "Failed to withdraw funds", "error");
                                 }
                               });
                            }
                          }}
                          disabled={withdrawMutation.isPending}
                          className="bg-white text-emerald-600 hover:bg-emerald-50 h-8 text-xs font-black px-4 rounded-xl"
                        >
                          {withdrawMutation.isPending ? 'Processing...' : 'Withdraw'}
                        </Button>
                      </div>
                    </div>
                  </Card>

                  {/* Loan Eligibility */}
                  <Card className={`border-none rounded-[2rem] p-6 shadow-xl relative overflow-hidden ${loanEligible ? 'bg-blue-50 text-blue-900' : 'bg-slate-50 text-slate-400'}`}>
                    <Landmark className={`absolute -right-4 -bottom-4 w-24 h-24 ${loanEligible ? 'text-blue-200/50' : 'text-slate-200/50'}`} />
                    <div className="relative z-10">
                      <div className="text-[10px] font-black uppercase tracking-widest mb-2">Loan Capacity</div>
                      <div className="text-2xl font-black mb-1 flex items-center gap-2">
                        {loanEligible ? (
                          <><CheckCircle2 className="w-5 h-5 text-blue-600" /> ELIGIBLE</>
                        ) : (
                          <><AlertCircle className="w-5 h-5 text-slate-300" /> PENDING</>
                        )}
                      </div>
                      {loanEligible ? (
                        <div className="text-xl font-black text-blue-700 mt-4">{formatNaira(recommendedLoan)}</div>
                      ) : (
                        <div className="text-xs font-bold mt-4">Continue building history</div>
                      )}
                    </div>
                  </Card>

                  {/* Insurance Status */}
                  <Card className={`border-none rounded-[2rem] p-6 shadow-xl relative overflow-hidden ${risk.bg} ${risk.text}`}>
                    <ShieldCheck className={`absolute -right-4 -bottom-4 w-24 h-24 opacity-10`} />
                    <div className="relative z-10">
                      <div className="text-[10px] font-black uppercase tracking-widest mb-2">Insurance Risk</div>
                      <div className="text-2xl font-black mb-1 flex items-center gap-2 uppercase">
                        <BadgeCheck className={`w-5 h-5 ${risk.iconColor}`} /> {riskLevel}
                      </div>
                      <div className="mt-4">
                        <div className="flex justify-between text-[10px] font-bold mb-1">
                          <span>Reliability Pct</span>
                          <span>{riskLevel === 'low' ? '98%' : '82%'}</span>
                        </div>
                        <Progress value={riskLevel === 'low' ? 98 : 82} className="h-1 bg-white/50" />
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Income Trend Chart */}
                <Card className="border-none shadow-2xl shadow-navy-100/50 rounded-[2.5rem] p-8 bg-white flex-1">
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <h3 className="font-black text-navy-900 text-xl tracking-tight">Income Analytics</h3>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Verified Revenue Pipeline</p>
                    </div>
                    <Badge className="bg-emerald-50 text-emerald-600 border-none font-black text-xs px-4 py-1.5">+42% YoY Growth</Badge>
                  </div>
                  
                  <div className="h-[220px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={earningsMock}>
                        <defs>
                          <linearGradient id="earnGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="8 8" stroke="#f1f5f9" vertical={false} />
                        <XAxis dataKey="month" tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v) => `₦${v / 1000}K`} />
                        <Tooltip 
                          formatter={(v: unknown) => [`₦${Number(v).toLocaleString()}`, 'Earnings']} 
                          contentStyle={{ borderRadius: '1.5rem', border: 'none', boxShadow: '0 20px 50px rgba(10,22,40,0.1)', fontSize: '12px', fontWeight: 'bold' }} 
                        />
                        <Area type="monotone" dataKey="earnings" stroke="#10B981" strokeWidth={4} fill="url(#earnGrad)" dot={{ fill: '#10B981', stroke: '#fff', strokeWidth: 2, r: 6 }} activeDot={{ r: 8, strokeWidth: 0 }} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </div>

              {/* Identity Factors Row */}
              <Card className="lg:col-span-3 border-none shadow-2xl shadow-navy-100/50 rounded-[2.5rem] p-10 bg-white">
                <div className="flex items-center gap-3 mb-10">
                  <div className="w-10 h-10 rounded-xl bg-navy-900 flex items-center justify-center text-white">
                    <PieChartIcon className="w-5 h-5" />
                  </div>
                  <h3 className="font-black text-navy-900 text-xl tracking-tight">National Economic Identity Factors</h3>
                </div>
                
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
                  {[
                    { label: 'Reliability Rate', value: `${Math.round(onTimeRate * 100)}%`, icon: Clock, desc: 'Tasks completed on or before schedule' },
                    { label: 'Ecosystem Volume', value: workerProfile?.tasks_completed ?? 42, icon: Briefcase, desc: 'Total verified transactions on OS' },
                    { label: 'Public Rating', value: `${Number(workerProfile?.avg_rating ?? 4.8).toFixed(1)}★`, icon: Star, desc: 'AI-verified customer satisfaction score' },
                    { label: 'System Integrity', value: '100%', icon: ShieldCheck, desc: 'Zero disputes or flagged interactions' },
                  ].map((metric) => (
                    <div key={metric.label} className="flex flex-col gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center">
                          <metric.icon className="w-5 h-5 text-navy-900" />
                        </div>
                        <div className="text-2xl font-black text-navy-900">{metric.value}</div>
                      </div>
                      <div>
                        <div className="text-[10px] font-black text-navy-900 uppercase tracking-widest mb-1">{metric.label}</div>
                        <div className="text-[10px] text-slate-400 font-bold leading-relaxed">{metric.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Credit Opportunity CTA */}
              {loanEligible && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                  className="lg:col-span-3 rounded-[2.5rem] p-10 bg-gradient-to-r from-navy-950 to-blue-900 text-white flex flex-col lg:flex-row items-center justify-between gap-10 overflow-hidden relative"
                >
                  <div className="absolute top-0 right-0 w-full h-full opacity-5 pointer-events-none">
                     <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(#ffffff_2px,transparent_2px)] [background-size:24px_24px]" />
                  </div>
                  <div className="relative z-10 text-center lg:text-left">
                    <Badge className="bg-emerald-500 text-white border-none px-4 py-1 mb-4 uppercase tracking-widest font-black">Capital Access Unlocked</Badge>
                    <h2 className="text-3xl md:text-4xl font-black mb-4 tracking-tight leading-tight">You qualify for {formatNaira(recommendedLoan)} in working capital 🎉</h2>
                    <p className="text-slate-400 text-lg font-medium max-w-2xl">Based on your ecosystem history and trust score. Zero paperwork. Instant disbursement.</p>
                  </div>
                  <Button onClick={() => setShowLoan(true)} className="h-16 px-12 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white font-black text-xl shadow-2xl shadow-emerald-900/20 whitespace-nowrap relative z-10 transition-transform hover:scale-105 active:scale-95">
                    Apply & Unlock Capital <ArrowUpRight className="ml-3 w-6 h-6" />
                  </Button>
                </motion.div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Disputes Section - Visible to both workers and buyers */}
      <div className="mt-12">
        <div className="mb-6">
          <h2 className="text-2xl font-black text-navy-900 tracking-tight mb-2">Active Disputes</h2>
          <p className="text-slate-400 text-sm font-medium">Review and manage any ongoing disputes</p>
        </div>
        <DisputesSection />
      </div>
    </div>

    <LoanModal isOpen={showLoan} onClose={() => setShowLoan(false)} maxAmount={recommendedLoan} />
    <InsuranceModal isOpen={showInsurance} onClose={() => setShowInsurance(false)} />
    <KYCModal isOpen={showKYC} onClose={() => setShowKYC(false)} />
    </>
  )
}
