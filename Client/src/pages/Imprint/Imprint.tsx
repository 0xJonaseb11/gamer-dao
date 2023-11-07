import { useTranslation } from 'react-i18next';

import { PolicyContainer } from 'pages/DataPrivacy/styles';

function Imprint () {
  const { t } = useTranslation();

  return (
    <PolicyContainer title={t('IMPRINT')}>
      <div className="block privacy-content">
        <div className="privacy-block">
          <p className="text-md">Responsible for the content of the website:</p>
          <h2 className="text-xl font-semibold">Q Development AG</h2>
        </div>

        <ul className="privacy-list privacy-block">
          <li className="text-md">Rhigass 1</li>
          <li className="text-md">9487 Gamprin-Bendern</li>
          <li className="text-md">Liechtenstein</li>
          <li className="text-md">FL-Nummer: FL-000.2.643.198-4</li>
          <li className="text-md">(Commercial Register of Liechtenstein)</li>
          <li className="text-md">Suliervisory Authority: Amt für Volkswirtschaft, Vaduz</li>
        </ul>

        <div className="privacy-block">
          <h2 className="text-h2">Contact us</h2>
          <ul className="privacy-list privacy-block">
            <li className="text-md">Email: info@qdev.li</li>
            <li className="text-md">Phone: +423 230 00 72</li>
          </ul>
        </div>

        <div className="privacy-block">
          <h2 className="text-h2">Disclaimer (limitation of liability)</h2>
          <p className="text-md">
            The information provided on this website has been carefully checked and is regularly updated. However, no
            guarantee can be given that all information is complete, correct and up-to-date at all times. This applies
            in particular to links to other websites to which direct or indirect reference is made. Q Development AG
            does not accept any liability for damages or consequential damages arising out of access to its website or
            parts thereof. All information can be supplemented, removed or changed without prior notice.
          </p>
        </div>
      </div>
    </PolicyContainer>
  );
}

export default Imprint;
