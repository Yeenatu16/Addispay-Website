'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, FileText, ArrowLeft, Mail, Phone, Lock, Scale, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function TermsPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-[#F8FDFB] text-[#101828]">
      
      {/* Hero Header */}
      <div className="bg-gradient-to-b from-[#E5F5EE]/80 via-[#F8FDFB] to-[#F8FDFB] py-14 sm:py-20 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E5F5EE] border border-[#00A36D]/30 text-[#00A36D] text-xs font-extrabold shadow-xs">
            <ShieldCheck className="w-4 h-4 text-[#00A36D]" />
            <span>NBE Licensed Platform · NPS/PSO/007/2022</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#101828] tracking-tight">
            Terms &amp; Conditions
          </h1>

          <p className="text-sm sm:text-base text-[#6A7282] max-w-2xl mx-auto leading-relaxed">
            Legal agreement governing your access to and use of Addispay’s payment services, mobile applications, and digital platforms.
          </p>

          <div className="pt-2">
            <span className="text-xs font-semibold text-gray-400">
              Last Updated: August 2026 · Compliant with Ethiopian Law &amp; NBE Directives
            </span>
          </div>

        </div>
      </div>

      {/* Main Document Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">

        {/* Introduction Box */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4 text-sm text-[#475467] leading-relaxed">
          <p>
            These Terms and Conditions (“Terms”) contained on this webpage is a legal agreement between you, as a prospective customer of Addispay services and Addispay Incorporated (Addispay, “we”, “our” or “us”) and shall govern your access to and use of Addispay’s services which include all pages within the Addispay website (<a href="https://addispay.et" target="_blank" rel="noopener noreferrer" className="text-[#00A36D] font-bold underline">https://addispay.et/</a>), mobile applications and other products and services (collectively referred to as the “Services”). By accessing or using the Site or Services, you agree to be bound by these Terms.
          </p>
          <p>
            These Terms apply in full force and effect to your use of the Services and by using any of the Services, you expressly accept all terms and conditions contained herein in full and without limitation or qualification, including our Privacy policy.
          </p>
        </div>

        {/* Section 1: Terms & Conditions */}
        <div className="space-y-8 bg-white p-6 sm:p-10 rounded-3xl border border-gray-100 shadow-sm">
          
          <div className="border-b border-gray-100 pb-4">
            <h2 className="text-2xl font-black text-[#101828] flex items-center gap-2.5">
              <Scale className="w-6 h-6 text-[#00A36D]" />
              <span>1. General Terms and Conditions</span>
            </h2>
          </div>

          <div className="space-y-8 text-sm text-[#344054] leading-relaxed">
            
            {/* 1. Acceptance of Terms */}
            <div className="space-y-2">
              <h3 className="text-base font-bold text-[#101828]">1. Acceptance of Terms</h3>
              <p>
                By accessing or using the Site or Services, you agree to these Terms and our Privacy Policy. If you do not agree to these Terms or the Privacy Policy, you may not access or use the Site or Services.
              </p>
            </div>

            {/* 2. Who we are and Our Company */}
            <div className="space-y-2">
              <h3 className="text-base font-bold text-[#101828]">2. Who we are and Our Company?</h3>
              <p>
                Addispay Financial Technology Share Company is a new financial technology (Fin-tech) company that delivers convenient, innovative, safe and secure payment processing services and platforms in the Ethiopian market.
              </p>
              <p>
                The company provides M-POS and gateway and related digital financial services in Ethiopia by leveraging the latest M-POS and online payment technology platform in the industry and developing user-oriented products and services that will allow people to use their mobile phone and their payment instruments for conducting financial services including payments. Addispay aspires to make a significant contribution to the financial sector by offering digital based payments services that meet the needs of consumers and merchants towards cash-lite transactions in line with the national agenda of digital economy.
              </p>
            </div>

            {/* 3. Use of the Services */}
            <div className="space-y-2">
              <h3 className="text-base font-bold text-[#101828]">3. Use of the Services</h3>
              <ul className="list-disc pl-5 space-y-1 text-gray-700">
                <li>You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate, current, and complete.</li>
                <li>You are responsible for maintaining the confidentiality of your account and password and for restricting access to your account. You agree to accept responsibility for all activities that occur under your account or password.</li>
              </ul>
            </div>

            {/* 4. Who May Use Our Services? */}
            <div className="space-y-2">
              <h3 className="text-base font-bold text-[#101828]">4. Who May Use Our Services?</h3>
              <p>
                You may use the Services only if you agree to form a binding contract with Addispay and are not below the age of 18. If you are accepting these Terms and using the Services on behalf of a company, business, or organization, you represent and warrant that you are authorized to do so.
              </p>
            </div>

            {/* 5. License to Use Our Website */}
            <div className="space-y-2">
              <h3 className="text-base font-bold text-[#101828]">5. License to Use Our Website</h3>
              <p>
                We grant you a non-assignable, non-exclusive and revocable license to use the software provided as part of our Services in the manner permitted by these Terms. This license grant includes all updates, upgrades, new versions and replacement software for your use in connection with our Services.
              </p>
              <p>
                The Services are protected by copyright, trademark, and other appropriate laws of Ethiopia. Nothing in these Terms gives you a right to use the Addispay name or any of Addispay’s trademarks, logos, domain names, and other distinctive brand features. All right, title and interest in and to the Services are and will remain the exclusive property of Addispay and its licensors.
              </p>
              <p>
                If you do not comply with all the provisions, then you will be liable for all resulting damages suffered by you, Addispay and all third parties. Unless otherwise provided by applicable law, you agree not to alter, re-design, reproduce, adapt, display, distribute, translate, disassemble, reverse engineer, or otherwise attempt to create any source code that is derived from the software.
              </p>
              <p>
                Any feedback, comments, or suggestions you may provide to us and our Services is entirely voluntary and we will be free to use such feedback, comments or suggestions as we see fit without any obligation to you.
              </p>
            </div>

            {/* 6. Information Security and Warranty Disclaimer */}
            <div className="space-y-2">
              <h3 className="text-base font-bold text-[#101828]">6. Information Security and Warranty Disclaimer</h3>
              <p>
                Addispay will use its best efforts to ensure that the website is available at all times and bug free. However, it is used at your own risk.
              </p>
              <p className="uppercase text-xs font-semibold text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-200">
                We provide all materials “as is” with no warranty, express or implied, of any kind. We expressly disclaim any and all warranties and conditions, including any implied warranty or condition of merchantability, fitness for a particular purpose, availability, security, title, and non-infringement of intellectual property rights. Without limiting the generality of the foregoing, Addispay makes no warranty that our website and services will meet your requirements or that our website will remain free from any interruption, bugs, inaccuracies, and error.
              </p>
              <p>
                Your use of our services is at your own risk and you alone will be responsible for any damage that results in loss of data or damage to your computer system. No advice or information, whether oral or written obtained by you from our website or our services will create any warranty or condition not expressly stated.
              </p>
              <p className="font-semibold text-[#00A36D]">
                To use our services, you are required to enable 2 Factor Authentication (2FA) as an extra layer of protection to guarantee the security of your account. Addispay shall not bear any liability for any loss or risk suffered, where you do not enable 2FA.
              </p>
              <p>
                You are responsible for configuring your information technology, computer programmes and platform in order to access our Services. Please ensure you use your virus protection software or application as we cannot guarantee that our Services will be free from viruses or bugs.
              </p>
              <p>
                You must not attempt to gain unauthorized access to our Services, computers or databases. You must not misuse our Services by introducing trojans, viruses or other materials which are malicious or technologically harmful.
              </p>
            </div>

            {/* 7. Limitation of Liability */}
            <div className="space-y-2">
              <h3 className="text-base font-bold text-[#101828]">7. Limitation of Liability</h3>
              <p>
                Your use of the Addispay website and services is at your own risk. You agree to the limitation of liability clause to the maximum extent permitted by Ethiopian law: Addispay will in no way be liable for any direct, indirect, incidental, punitive, consequential, special or exemplary damages or any damages including damages resulting from revenue loss, profit loss, use, data, goodwill, business interruption or any other intangible losses (whether Addispay has been advised of the possibility of such damages or not) arising out of Addispay’s website or services whether such damages are based on warranty, tort, contract, or statute.
              </p>
            </div>

            {/* 8. Indemnification */}
            <div className="space-y-2">
              <h3 className="text-base font-bold text-[#101828]">8. Indemnification</h3>
              <p>
                You hereby indemnify Addispay and undertake to keep Addispay, its staff and affiliates indemnified against any losses, damages, costs, liabilities and expenses (including without limitation reasonable legal fees and expenses) arising out of any breach by you of any provision of these Terms, or arising out of any claim that you have breached any provision of these Terms. You will indemnify and hold Addispay harmless from and against any claim, suit or proceedings brought against Addispay arising from or in connection with violations of intellectual property or other rights of third parties in relation to your use of the Services.
              </p>
            </div>

            {/* 9. Breach of these Terms */}
            <div className="space-y-2">
              <h3 className="text-base font-bold text-[#101828]">9. Breach of these Terms</h3>
              <p>
                Without prejudice to Addispay’s other rights under these Terms, if you breach these Terms in any way, Addispay may take such action as Addispay deems appropriate to deal with the breach, including suspending your access to the website, prohibiting you from accessing the website, blocking computers using your IP address from accessing the website, contacting your internet service provider requesting that your access to the website be blocked and/or bringing court proceedings against you.
              </p>
            </div>

            {/* 10. Cookies */}
            <div className="space-y-2">
              <h3 className="text-base font-bold text-[#101828]">10. Cookies Policy</h3>
              <ol className="list-decimal pl-5 space-y-1.5 text-gray-700">
                <li>Addispay uses cookies and similar technologies on its website to help collect information and operate the site. Addispay uses cookies to remember users and make your user experience easier; customize our services, content and advertising; help you ensure that your account security is not compromised; mitigate risk and prevent fraud; and to promote trust and safety on our website. Cookies are small text files placed by a website and stored by your browser on your device.</li>
                <li>Addispay cookies hold a unique random reference to you so that once you visit the site, Addispay can recognize who you are and provide certain content to you.</li>
                <li>Most web browsers are set to accept cookies by default. You can go to your browser settings to learn how to delete or reject cookies. If you choose to delete or reject cookies, this may impact your experience using Addispay website.</li>
                <li>We reserve the right to make changes to this Cookies clause at any time and for any reason. We will alert you about any changes by updating the “Last Updated” date of this Cookie and by continued use of the site after the date of such revision you will be deemed to have been made aware of, will be subject to, and will be deemed to have accepted the changes.</li>
              </ol>
            </div>

            {/* 11. Intellectual Property */}
            <div className="space-y-2">
              <h3 className="text-base font-bold text-[#101828]">11. Intellectual Property</h3>
              <p>
                The Site and Services, including all content, features, and functionality thereof, are owned by Addispay or its licensors and are protected by copyright, trademark, and other intellectual property laws. You may not modify, reproduce, distribute, or create derivative works based on the Site or Services.
              </p>
            </div>

            {/* 12. Limitation of Liability (General) */}
            <div className="space-y-2">
              <h3 className="text-base font-bold text-[#101828]">12. Additional Liability Limitations</h3>
              <p>
                Addispay shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of the Site or Services.
              </p>
            </div>

            {/* 13. Indemnification */}
            <div className="space-y-2">
              <h3 className="text-base font-bold text-[#101828]">13. Additional Indemnification</h3>
              <p>
                You agree to indemnify, defend, and hold harmless Addispay and its officers, directors, employees, agents, and affiliates from and against any and all claims, liabilities, damages, losses, costs, expenses, or fees (including reasonable attorneys&apos; fees) arising out of or related to your use of the Site or Services.
              </p>
            </div>

            {/* 14. Termination */}
            <div className="space-y-2">
              <h3 className="text-base font-bold text-[#101828]">14. Termination</h3>
              <p>
                Addispay may terminate or suspend your access to the Site or Services at any time, with or without cause, without prior notice or liability.
              </p>
            </div>

            {/* 15. Governing Law */}
            <div className="space-y-2">
              <h3 className="text-base font-bold text-[#101828]">15. Governing Law</h3>
              <p>
                These Terms shall be governed by and construed in accordance with the laws of Federal Democratic Republic of Ethiopia, without regard to its conflict of law principles.
              </p>
            </div>

            {/* 16. Changes to Terms */}
            <div className="space-y-2">
              <h3 className="text-base font-bold text-[#101828]">16. Changes to Terms</h3>
              <p>
                Addispay reserves the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days&apos; notice prior to any new terms taking effect.
              </p>
            </div>

            {/* 17. Contact Us */}
            <div className="space-y-2 bg-[#E5F5EE]/60 p-4 rounded-2xl border border-[#00A36D]/20">
              <h3 className="text-base font-bold text-[#101828]">17. Contact Information for Terms</h3>
              <p>
                If you have any questions about these Terms, please contact us at:
              </p>
              <div className="font-semibold text-xs text-[#00A36D] space-y-1">
                <div>Email: support@addispay.et / info@addispay.co</div>
                <div>Phone: +251 11 668 5873 / +251 11 668 4243</div>
                <div>Short Code: 8710</div>
              </div>
            </div>

          </div>
        </div>

        {/* Section 2: Personal Data and Consumer Protection Policy */}
        <div className="space-y-8 bg-white p-6 sm:p-10 rounded-3xl border border-gray-100 shadow-sm">
          
          <div className="border-b border-gray-100 pb-4">
            <h2 className="text-2xl font-black text-[#101828] flex items-center gap-2.5">
              <Lock className="w-6 h-6 text-[#00A36D]" />
              <span>2. Personal Data and Consumer Protection Policy</span>
            </h2>
            <p className="text-xs text-gray-500 font-semibold pt-1">
              Compliant with Personal Data Protection Proclamation 1321/2024 &amp; NBE Directive FCP/01/2020
            </p>
          </div>

          <div className="space-y-8 text-sm text-[#344054] leading-relaxed">

            {/* 1. Introduction */}
            <div className="space-y-2">
              <h3 className="text-base font-bold text-[#101828]">1. Introduction</h3>
              <p>
                Addispay Financial Technology Share Company (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) is committed to protecting the privacy and personal data of our users and customers in accordance with the Personal Data Protection Proclamation 1321/2024 and National Bank of Ethiopia Directive on Financial Consumer Protection (Directive FCP/01/2020). This Personal Data and Consumer Protection Term and Policy outlines our approach to ensuring consumer protection and how we collect, use, disclose, and protect personal data in compliance with applicable laws and regulations in Ethiopia.
              </p>
              <p>
                By accessing our services, you/users agree to the collection, use, and disclosure of their personal data as described in this policy.
              </p>
            </div>

            {/* 2. Collection Guiding Principles */}
            <div className="space-y-2">
              <h3 className="text-base font-bold text-[#101828]">2. Collection Guiding Principles</h3>
              <ul className="list-disc pl-5 space-y-1.5 text-gray-700">
                <li><strong>Purpose Limitation:</strong> We collect personal data only for specified, explicit, and legitimate purposes as outlined in this policy. Personal data is collected with the consent of the individual and is used only for the purposes for which it was collected.</li>
                <li><strong>Data Minimization:</strong> We collect only the minimum amount of personal data necessary to fulfill the specified purposes. We do not retain personal data for longer than necessary.</li>
                <li><strong>Lawful Basis:</strong> We process personal data only when we have a lawful basis to do so, such as the consent of the data subject, contractual necessity, legal obligations, or legitimate interests pursued by us or a third party.</li>
              </ul>
            </div>

            {/* 3. Data We Collect */}
            <div className="space-y-2">
              <h3 className="text-base font-bold text-[#101828]">3. Data We Collect</h3>
              <p>We collect personal data necessary for providing payment services, including but not limited to:</p>
              <ul className="list-disc pl-5 space-y-1 text-gray-700">
                <li>Name</li>
                <li>Contact information (phone number, email address)</li>
                <li>Payment information (credit/debit card details, bank account information)</li>
                <li>Transaction history</li>
                <li>Location data (for transaction verification and fraud prevention)</li>
              </ul>
              <p className="pt-2">
                We collect personal data directly from users or from third parties with consent or as permitted by law. We use personal data for processing payments, providing customer support, improving services, and marketing activities with user consent.
              </p>
            </div>

            {/* 4. Consumer Rights */}
            <div className="space-y-2">
              <h3 className="text-base font-bold text-[#101828]">4. Consumer Rights</h3>
              <ul className="list-disc pl-5 space-y-1.5 text-gray-700">
                <li><strong>Access and Rectification:</strong> Individuals have the right to access their personal data held by Addispay and to rectify any inaccuracies by submitting a request to the Data Protection Officer.</li>
                <li><strong>Data Portability:</strong> Upon request, individuals have the right to receive a copy of their personal data in a structured, commonly used, and machine-readable format.</li>
                <li><strong>Objection and Withdrawal of Consent:</strong> Individuals have the right to object to the processing of their personal data or to withdraw consent at any time.</li>
              </ul>
            </div>

            {/* 5. Disclosure of Personal Data */}
            <div className="space-y-2">
              <h3 className="text-base font-bold text-[#101828]">5. Disclosure of Personal Data</h3>
              <p>
                We may disclose personal data to third-party service providers for the purposes of processing payments, fraud prevention, and compliance with legal obligations or in response to valid legal requests.
              </p>
            </div>

            {/* 6. Complaints and Redress */}
            <div className="space-y-2">
              <h3 className="text-base font-bold text-[#101828]">6. Complaints and Redress</h3>
              <p>
                We have established procedures for handling complaints regarding the processing of personal data. Complaints should be submitted in writing to the Data Protection Officer (support@addispay.et). Individuals have the right to seek redress through legal channels if they believe their rights have been infringed.
              </p>
            </div>

            {/* 7. Data Security */}
            <div className="space-y-2">
              <h3 className="text-base font-bold text-[#101828]">7. Data Security</h3>
              <p>
                We implement appropriate technical and organizational measures (including 256-bit AES payload encryption, PCI-DSS standards, and multi-factor authentication) to protect personal data from unauthorized access, disclosure, alteration, or destruction.
              </p>
            </div>

            {/* 8. Retention of Personal Data */}
            <div className="space-y-2">
              <h3 className="text-base font-bold text-[#101828]">8. Retention of Personal Data</h3>
              <p>
                We retain personal data only for as long as necessary to fulfill the purposes for which it was collected, including legal, accounting, or NBE regulatory reporting requirements.
              </p>
            </div>

            {/* 9. Consumer Rights Actions */}
            <div className="space-y-2">
              <h3 className="text-base font-bold text-[#101828]">9. Consumer Rights Channels</h3>
              <p>
                Users have the right to access, correct, or delete their personal data or withdraw consent through designated customer support channels.
              </p>
            </div>

            {/* 10. Changes to the Policy */}
            <div className="space-y-2">
              <h3 className="text-base font-bold text-[#101828]">10. Changes to the Policy</h3>
              <p>
                We reserve the right to update or modify this policy at any time. Changes will be communicated to users through our website or official notices.
              </p>
            </div>

            {/* 11. Contact Information */}
            <div className="space-y-2 bg-[#E5F5EE]/60 p-4 rounded-2xl border border-[#00A36D]/20">
              <h3 className="text-base font-bold text-[#101828]">11. Data Protection Officer Contact</h3>
              <p>
                For questions or concerns regarding this policy or our data practices, users can contact us at:
              </p>
              <div className="font-semibold text-xs text-[#00A36D] space-y-1">
                <div>Email: support@addispay.et</div>
                <div>Phone: +251 11 668 4243 / +251 11 668 5873</div>
                <div>Short Code: 8710</div>
              </div>
            </div>

            {/* 12 & 13. Compliance & Governing Law */}
            <div className="space-y-2">
              <h3 className="text-base font-bold text-[#101828]">12. Compliance &amp; Governing Law</h3>
              <p>
                We comply with all applicable laws concerning personal data protection, including Ethiopia&apos;s Personal Data Protection Proclamation 1321/2024 and NBE Directive FCP/01/2020. This policy shall be governed by and construed in accordance with the laws of Ethiopia.
              </p>
            </div>

          </div>
        </div>

        {/* Back Link */}
        <div className="text-center pt-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[#00A36D] font-bold text-sm hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Home</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
