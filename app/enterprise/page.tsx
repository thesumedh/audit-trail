"use client";

import { motion } from "framer-motion";
import { Shield, Lock, FileText, Eye, TrendingUp, Globe, Zap, CheckCircle, ArrowRight, Users, Building, Award } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import Link from "next/link";

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function EnterprisePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

        <div className="relative z-10 container mx-auto px-6">
          <motion.div 
            className="text-center max-w-4xl mx-auto"
            initial="initial"
            animate="animate"
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="mb-6">
              <div className="inline-flex items-center gap-3 bg-gray-900/80 border border-gray-700 rounded-lg px-6 py-3">
                <Building className="w-5 h-5 text-gray-300" />
                <span className="text-gray-300 font-medium">Legal Enterprise Solutions</span>
              </div>
            </motion.div>

            <motion.h1 
              variants={fadeInUp}
              className="text-5xl md:text-6xl font-bold text-white mb-8 leading-tight tracking-tight"
            >
              Enterprise Legal
              <br />
              <span className="text-gray-400">Evidence Platform</span>
            </motion.h1>

            <motion.p 
              variants={fadeInUp}
              className="text-xl text-gray-300 mb-12 leading-relaxed"
            >
              Comprehensive blockchain verification platform designed for law firms, 
              regulatory bodies, and enterprises requiring court-admissible evidence standards.
            </motion.p>

            <motion.div 
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-6 justify-center"
            >
              <Button size="lg" className="bg-white text-black hover:bg-gray-100 px-10 py-4 text-lg font-semibold">
                Schedule Consultation
                <ArrowRight className="ml-3 w-5 h-5" />
              </Button>
              <Link href="/dashboard">
                <Button variant="outline" size="lg" className="border-gray-600 text-gray-300 hover:bg-gray-900 hover:border-gray-500 px-10 py-4 text-lg">
                  View Evidence Platform
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Enterprise Features */}
      <section className="py-24 bg-slate-800/30">
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.h2 variants={fadeInUp} className="text-4xl font-bold text-white mb-6">
              Complete Enterprise Platform
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-slate-300 max-w-3xl mx-auto">
              Everything your organization needs for blockchain-verified financial communications
            </motion.p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp}>
              <Card className="bg-slate-800/50 border-slate-700/50 hover:border-teal-500/50 transition-colors h-full">
                <CardHeader>
                  <div className="w-12 h-12 bg-teal-500/20 rounded-lg flex items-center justify-center mb-4">
                    <FileText className="w-6 h-6 text-teal-400" />
                  </div>
                  <CardTitle className="text-white">Compliance Feed</CardTitle>
                  <CardDescription className="text-slate-400">
                    Visual chronological log displaying all anchored events for specific entities. 
                    Perfect for investigators and compliance officers.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-slate-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      Real-time event tracking
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      Regulatory compliance reports
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      Audit-ready documentation
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="bg-slate-800/50 border-slate-700/50 hover:border-emerald-500/50 transition-colors h-full">
                <CardHeader>
                  <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center mb-4">
                    <Eye className="w-6 h-6 text-emerald-400" />
                  </div>
                  <CardTitle className="text-white">Legal Discovery</CardTitle>
                  <CardDescription className="text-slate-400">
                    Transform raw immutable data into understandable narratives for legal proceedings 
                    and regulatory investigations.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-slate-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      Immutable evidence trails
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      Cryptographic proof
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      Legal-ready reports
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="bg-slate-800/50 border-slate-700/50 hover:border-blue-500/50 transition-colors h-full">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                    <TrendingUp className="w-6 h-6 text-blue-400" />
                  </div>
                  <CardTitle className="text-white">Real-time Monitoring</CardTitle>
                  <CardDescription className="text-slate-400">
                    24/7 monitoring of financial communications with instant blockchain verification 
                    and alert systems.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-slate-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      Instant verification
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      Custom alert rules
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      Multi-channel monitoring
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Enterprise Benefits */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Why Leading Enterprises Choose Us
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Proven results for financial institutions, regulatory bodies, and global enterprises
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="text-center">
              <div className="w-16 h-16 bg-teal-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-teal-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">500+</div>
              <div className="text-slate-400">Enterprise Clients</div>
            </motion.div>

            <motion.div variants={fadeInUp} className="text-center">
              <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-emerald-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">99.9%</div>
              <div className="text-slate-400">Uptime SLA</div>
            </motion.div>

            <motion.div variants={fadeInUp} className="text-center">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-blue-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">SOC 2</div>
              <div className="text-slate-400">Type II Certified</div>
            </motion.div>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp}>
              <h3 className="text-3xl font-bold text-white mb-6">
                Regulatory Compliance Made Simple
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-emerald-400 mt-1 flex-shrink-0" />
                  <div>
                    <div className="text-white font-semibold">SEC & FINRA Ready</div>
                    <div className="text-slate-400">Pre-configured for financial regulatory requirements</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-emerald-400 mt-1 flex-shrink-0" />
                  <div>
                    <div className="text-white font-semibold">MiFID II Compliance</div>
                    <div className="text-slate-400">European regulatory framework support</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-emerald-400 mt-1 flex-shrink-0" />
                  <div>
                    <div className="text-white font-semibold">Automated Reporting</div>
                    <div className="text-slate-400">Generate compliance reports automatically</div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="bg-slate-800/50 border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-white">Enterprise Deployment Options</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded">
                    <span className="text-slate-300">Cloud Deployment</span>
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded">
                    <span className="text-slate-300">On-Premise Installation</span>
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded">
                    <span className="text-slate-300">Hybrid Architecture</span>
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded">
                    <span className="text-slate-300">API Integration</span>
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-slate-800/30">
        <div className="container mx-auto px-6 text-center">
          <motion.div 
            className="max-w-4xl mx-auto"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.h2 variants={fadeInUp} className="text-4xl font-bold text-white mb-6">
              Ready to Transform Your Compliance Strategy?
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-slate-300 mb-12">
              Join the leading financial institutions already using blockchain verification 
              to ensure data integrity and regulatory compliance.
            </motion.p>
            <motion.div 
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button size="lg" className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white px-8 py-4 text-lg font-semibold">
                Schedule Enterprise Demo
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button variant="outline" size="lg" className="border-slate-600 text-slate-300 hover:bg-slate-800 px-8 py-4 text-lg">
                Download White Paper
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}