import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-headline">Privacy Policy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 prose prose-sm sm:prose lg:prose-lg xl:prose-xl dark:prose-invert max-w-none">
          <p><strong>Last Updated: {new Date().toLocaleDateString()}</strong></p>

          <p>Welcome to Forge PDF (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;). We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about this privacy notice, or our practices with regards to your personal information, please contact us.</p>

          <h2 className="font-headline">1. INFORMATION WE COLLECT</h2>
          <p>We collect personal information that you voluntarily provide to us when you register on the application, express an interest in obtaining information about us or our products and services, when you participate in activities on the application or otherwise when you contact us.</p>
          <p>The personal information that we collect depends on the context of your interactions with us and the application, the choices you make and the products and features you use. The personal information we collect may include the following: names, email addresses, passwords, contact preferences, and other similar information.</p>

          <h2 className="font-headline">2. HOW WE USE YOUR INFORMATION</h2>
          <p>We use personal information collected via our application for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.</p>
          <ul className="list-disc pl-6">
            <li>To facilitate account creation and logon process.</li>
            <li>To manage user accounts.</li>
            <li>To send administrative information to you.</li>
            <li>To protect our Services.</li>
            <li>To respond to legal requests and prevent harm.</li>
          </ul>

          <h2 className="font-headline">3. WILL YOUR INFORMATION BE SHARED WITH ANYONE?</h2>
          <p>We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations.</p>

          <h2 className="font-headline">4. HOW LONG DO WE KEEP YOUR INFORMATION?</h2>
          <p>We will only keep your personal information for as long as it is necessary for the purposes set out in this privacy notice, unless a longer retention period is required or permitted by law (such as tax, accounting or other legal requirements).</p>

          <h2 className="font-headline">5. HOW DO WE KEEP YOUR INFORMATION SAFE?</h2>
          <p>We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure, so we cannot promise or guarantee that hackers, cybercriminals, or other unauthorized third parties will not be able to defeat our security, and improperly collect, access, steal, or modify your information.</p>
          
          <h2 className="font-headline">6. CHANGES TO THIS PRIVACY NOTICE</h2>
          <p>We may update this privacy notice from time to time. The updated version will be indicated by an updated &quot;Last Updated&quot; date and the updated version will be effective as soon as it is accessible. We encourage you to review this privacy notice frequently to be informed of how we are protecting your information.</p>

          <h2 className="font-headline">7. CONTACT US</h2>
          <p>If you have questions or comments about this notice, you may email us at privacy@forgepdf.example.com (this is a placeholder email).</p>
        </CardContent>
      </Card>
    </div>
  );
}
