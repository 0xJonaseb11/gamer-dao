import { HTMLAttributes, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Icon, Modal } from '@q-dev/q-ui-kit';
import { useCopyToClipboard } from '@q-dev/react-hooks';

import Button from 'components/Button';

import { StyledShareContent } from './styles';

interface Props extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  text?: string;
  url: string;
}

function ShareButton ({ title = '', text = '', url, ...rest }: Props) {
  const { t } = useTranslation();

  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [copied, copy] = useCopyToClipboard();

  const handleShare = () => {
    if ('share' in navigator) {
      navigator.share({ title, text, url });
      return;
    }

    setShareModalOpen(true);
  };

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedText = encodeURIComponent(text);

  const socialLinks = [
    {
      name: 'Reddit',
      iconSrc: '/icons/reddit.svg',
      href: `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`
    },
    {
      name: 'Telegram',
      iconSrc: '/icons/telegram.svg',
      href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`
    },
    {
      name: 'Twitter',
      iconSrc: '/icons/twitter.svg',
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`
    },
    {
      name: 'Facebook',
      iconSrc: '/icons/facebook.svg',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedTitle}`
    },
    {
      name: 'LinkedIn',
      iconSrc: '/icons/linkedin.svg',
      href: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}&summary=${encodedText}`
    },
    {
      name: 'WhatsApp',
      iconSrc: '/icons/whatsapp.svg',
      href: `https://web.whatsapp.com/send?text=${encodedTitle}%0A${encodedUrl}`
    }
  ];

  return (
    <div {...rest}>
      <Button
        alwaysEnabled
        look="secondary"
        onClick={handleShare}
      >
        <Icon name="share" />
        <span>{t('SHARE_ACTION')}</span>
      </Button>

      <Modal
        open={shareModalOpen}
        title={t('SHARE_LINK')}
        onClose={() => setShareModalOpen(false)}
      >
        <StyledShareContent>
          <Button
            alwaysEnabled
            look="secondary"
            style={{ width: '100%' }}
            onClick={() => copy(url)}
          >
            <Icon name={copied ? 'check-circle' : 'copy'} />
            <span>{copied ? t('COPIED') : t('COPY_LINK')}</span>
          </Button>

          <a
            href={`mailto:?subject=${encodedTitle}&body=${[encodedText, encodedUrl].filter(val => val).join('%0A')}`}
            target="_blank"
            rel="noreferrer"
          >
            <Button
              block
              alwaysEnabled
              look="secondary"
              style={{ width: '100%' }}
            >
              <Icon name="message" />
              <span>{t('SEND_BY_EMAIL')}</span>
            </Button>
          </a>

          <p className="share-socials-title text-lg font-semibold">
            {t('SOCIAL_MEDIA')}
          </p>

          <div className="share-socials">
            {socialLinks.map(({ name, iconSrc, href }) => (
              <a
                key={name}
                href={href}
                target="_blank"
                rel="noreferrer"
              >
                <Button
                  block
                  alwaysEnabled
                  look="secondary"
                  style={{ width: '100%' }}
                >
                  <img src={iconSrc} alt={name} />
                  <span>{name}</span>
                </Button>
              </a>
            ))}
          </div>
        </StyledShareContent>
      </Modal>
    </div>
  );
}

export default ShareButton;
