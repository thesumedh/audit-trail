"use client";

import { motion } from "framer-motion";
import { Shield, Lock, Eye, FileText, CheckCircle, AlertTriangle, ArrowRight, Scale, Gavel, Building2, Users, Award } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import Link from "next/link";

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: "easeOut" }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.15
    }
  }
};

export function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative">
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

        <div className="relative z-10 container mx-auto px-6 pt-24 pb-20">
          <motion.div 
            className="max-w-6xl mx-auto"
            initial="initial"
            animate="animate"
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="text-center mb-12">
              <div className="inline-flex items-center gap-3 bg-gray-900/80 border border-gray-700 rounded-lg px-6 py-3 mb-8">
                <Scale className="w-5 h-5 text-gray-300" />
                <span className="text-gray-300 font-medium">Enterprise Legal Technology</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight tracking-tight">
                Immutable Evidence
                <br />
                <span className="text-gray-400">for Legal Discovery</span>
              </h1>

              <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
                Blockchain-verified financial communications with cryptographic proof of authenticity. 
                Built for law firms, regulatory bodies, and compliance departments.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
                <Link href="/dashboard">
                  <Button size="lg" className="bg-white text-black hover:bg-gray-100 px-10 py-4 text-lg font-semibold border-0">
                    View Evidence Platform
                    <ArrowRight className="ml-3 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/enterprise">
                  <Button variant="outline" size="lg" className="border-gray-600 text-gray-300 hover:bg-gray-900 hover:border-gray-500 px-10 py-4 text-lg">
                    Legal Solutions
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Dashboard Preview */}
            <motion.div variants={fadeInUp} className="relative max-w-5xl mx-auto">
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
                    <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
                    <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
                  </div>
                  <div className="text-gray-500 text-sm font-mono">legal-evidence-platform.com</div>
                  <div className="ml-auto flex items-center gap-2 text-gray-300">
                    <Lock className="w-4 h-4" />
                    <span className="text-sm font-medium">Secured</span>
                  </div>
                </div>
                
                <div className="bg-black/50 rounded border border-gray-800 p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gray-900/50 rounded border border-gray-800 p-4">
                      <div className="text-white text-2xl font-bold">1,247</div>
                      <div className="text-gray-400 text-sm">Evidence Records</div>
                    </div>
                    <div className="bg-gray-900/50 rounded border border-gray-800 p-4">
                      <div className="text-white text-2xl font-bold">100%</div>
                      <div className="text-gray-400 text-sm">Cryptographic Integrity</div>
                    </div>
                    <div className="bg-gray-900/50 rounded border border-gray-800 p-4">
                      <div className="text-white text-2xl font-bold">24/7</div>
                      <div className="text-gray-400 text-sm">Compliance Monitoring</div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-gray-900/30 rounded border border-gray-800">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-gray-300" />
                        <span className="text-gray-200">Fed Rate Decision - Verified & Anchored</span>
                      </div>
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-200 border border-gray-700">
                        View Evidence
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-900/30 rounded border border-gray-800">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-gray-300" />
                        <span className="text-gray-200">Earnings Report - Immutable Record</span>
                      </div>
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-200 border border-gray-700">
                        View Evidence
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Legal Features */}
      <section className="py-24 bg-gray-950/50">
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold text-white mb-6">
              Legal-Grade Evidence Platform
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-gray-300 max-w-3xl mx-auto">
              Purpose-built for legal professionals who require the highest standards 
              of evidence integrity and regulatory compliance.
            </motion.p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp}>
              <Card className="bg-gray-900/50 border-gray-800 hover:border-gray-700 transition-colors h-full">
                <CardHeader>
                  <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center mb-4">
                    <FileText className="w-6 h-6 text-gray-300" />
                  </div>
                  <CardTitle className="text-white">Compliance Timeline</CardTitle>
                  <CardDescription className="text-gray-400">
                    Chronological audit trail of all document modifications and access events
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="bg-gray-900/50 border-gray-800 hover:border-gray-700 transition-colors h-full">
                <CardHeader>
                  <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center mb-4">
                    <Gavel className="w-6 h-6 text-gray-300" />
                  </div>
                  <CardTitle className="text-white">Legal Discovery</CardTitle>
                  <CardDescription className="text-gray-400">
                    Court-admissible evidence with cryptographic proof of authenticity
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="bg-gray-900/50 border-gray-800 hover:border-gray-700 transition-colors h-full">
                <CardHeader>
                  <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center mb-4">
                    <Eye className="w-6 h-6 text-gray-300" />
                  </div>
                  <CardTitle className="text-white">Evidence Monitoring</CardTitle>
                  <CardDescription className="text-gray-400">
                    Real-time verification of financial communications and market data
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="bg-gray-900/50 border-gray-800 hover:border-gray-700 transition-colors h-full">
                <CardHeader>
                  <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center mb-4">
                    <Shield className="w-6 h-6 text-gray-300" />
                  </div>
                  <CardTitle className="text-white">Regulatory Compliance</CardTitle>
                  <CardDescription className="text-gray-400">
                    SEC, FINRA, and MiFID II compliant evidence preservation
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Evidence Comparison */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Traditional vs. Blockchain Evidence
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              The difference between questionable documentation and legally admissible evidence
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp}>
              <Card className="bg-gray-900/30 border-gray-700 h-full">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <AlertTriangle className="w-8 h-8 text-gray-400" />
                    <CardTitle className="text-gray-300 text-2xl">Traditional Documentation</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-gray-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-300">Documents can be altered without detection</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-gray-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-300">Expensive forensic analysis required</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-gray-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-300">Chain of custody easily broken</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-gray-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-300">Authenticity challenges in court</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="bg-gray-900/50 border-gray-600 h-full">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <CheckCircle className="w-8 h-8 text-white" />
                    <CardTitle className="text-white text-2xl">Blockchain Evidence</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-200">Cryptographically immutable records</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-200">Automated chain of custody</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-200">Instant verification of authenticity</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-200">Court-admissible digital evidence</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Legal Adoption */}
      <section className="py-24 bg-gray-950/50">
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Trusted by Legal Professionals
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Law firms, regulatory agencies, and compliance departments rely on our platform
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp}>
              <Card className="bg-gray-900/50 border-gray-800 h-full">
                <CardHeader>
                  <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center mb-4">
                    <Building2 className="w-6 h-6 text-gray-300" />
                  </div>
                  <CardTitle className="text-white">Regulatory Compliance</CardTitle>
                  <CardDescription className="text-gray-400">
                    Meet SEC, FINRA, and international regulatory requirements with 
                    automated compliance reporting and audit trails.
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="bg-gray-900/50 border-gray-800 h-full">
                <CardHeader>
                  <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center mb-4">
                    <Users className="w-6 h-6 text-gray-300" />
                  </div>
                  <CardTitle className="text-white">Legal Discovery</CardTitle>
                  <CardDescription className="text-gray-400">
                    Streamline e-discovery processes with tamper-evident records 
                    and cryptographic proof of document integrity.
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="bg-gray-900/50 border-gray-800 h-full">
                <CardHeader>
                  <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center mb-4">
                    <Award className="w-6 h-6 text-gray-300" />
                  </div>
                  <CardTitle className="text-white">Evidence Integrity</CardTitle>
                  <CardDescription className="text-gray-400">
                    Ensure the highest standards of evidence preservation with 
                    blockchain-backed immutability and verification.
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-6 text-center">
          <motion.div 
            className="max-w-4xl mx-auto"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold text-white mb-6">
              Secure Your Legal Evidence Today
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-gray-300 mb-12">
              Join leading law firms and regulatory bodies in establishing 
              the new standard for digital evidence integrity.
            </motion.p>
            <motion.div 
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-6 justify-center"
            >
              <Link href="/dashboard">
                <Button size="lg" className="bg-white text-black hover:bg-gray-100 px-10 py-4 text-lg font-semibold">
                  Access Platform
                  <ArrowRight className="ml-3 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/enterprise">
                <Button variant="outline" size="lg" className="border-gray-600 text-gray-300 hover:bg-gray-900 hover:border-gray-500 px-10 py-4 text-lg">
                  Schedule Consultation
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}