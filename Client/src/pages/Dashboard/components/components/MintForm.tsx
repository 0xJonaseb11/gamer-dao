
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useForm } from '@q-dev/form-hooks';
import { Icon, Spinner } from '@q-dev/q-ui-kit';
import { toBigNumber } from '@q-dev/utils';
import { getErc5484OwnerOf, mintToErc5484 } from 'helpers';
import { mintToErc20 } from 'helpers/erc-20';
import { getErc721OwnerOf, mintToErc721 } from 'helpers/erc-721';
import styled from 'styled-components';

import Button from 'components/Button';
import Input from 'components/Input';

import useLoadDao from 'hooks/useLoadDao';

import MintDetails from './MintDetails';

import { useDaoTokenStore } from 'store/dao-token/hooks';
import { useTransaction } from 'store/transaction/hooks';

import { fromWeiWithDecimals, toWeiWithDecimals } from 'utils/numbers';
import { amount, integer, min, number, required, url } from 'utils/validators';

const StyledMintForm = styled.form<{$isIdValid: boolean}>`
  display: grid;
  gap: 16px;

  .mint-form__uri-tooltip {
    display: flex;
    margin-bottom: 12px;
  }

  .mint-form__validation-icon {
    color: ${({ theme, $isIdValid }) => $isIdValid ? theme.colors.successMain : theme.colors.errorMain}
  }
`;

interface Props {
  onSubmit: () => void;
}

function MintForm ({ onSubmit }: Props) {
  const { t } = useTranslation();
  const { submitTransaction } = useTransaction();
  const { tokenInfo } = useDaoTokenStore();
  const { loadAdditionalInfo } = useLoadDao();
  const [isLoading, setIsLoading] = useState(false);
  const [isValidTokenId, setIsValidTokenId] = useState(false);

  const maxMintValue = useMemo(() => {
    if (!tokenInfo) return '0';
    const mintValue = toBigNumber(tokenInfo.totalSupplyCap).minus(tokenInfo.totalSupply);
    return mintValue.isGreaterThan(0)
      ? fromWeiWithDecimals(mintValue.toString(), tokenInfo.decimals)
      : '0';
  }, [tokenInfo]);

  const isCanMint = useMemo(() => {
    return !!tokenInfo?.totalSupplyCap && Boolean(+maxMintValue);
  }, [maxMintValue]);

  const isNftLike = useMemo(() => {
    return tokenInfo?.type === 'erc5484' || tokenInfo?.type === 'erc721';
  }, [tokenInfo]);

  const form = useForm({
    initialValues: {
      recipient: tokenInfo?.owner || '',
      amount: '',
      tokenURI: tokenInfo?.baseURI || '',
      tokenId: ''
    },
    validators: {
      recipient: [required],
      amount: isNftLike ? [] : [required, number, ...maxMintValue ? [amount(maxMintValue)] : []],
      tokenURI: isNftLike ? [url] : [],
      tokenId: isNftLike ? [required, number, min(0), integer] : []
    },
    onSubmit: (form) => {
      submitTransaction({
        successMessage: t('MINT_TX'),
        onConfirm: () => onSubmit(),
        submitFn: () => {
          if (isNftLike) {
            const tokenURI = tokenInfo?.baseURI ? form.tokenURI.replace(tokenInfo.baseURI, '') : form.tokenURI;
            return tokenInfo?.type === 'erc721'
              ? mintToErc721(form.recipient, form.tokenId, tokenURI)
              : mintToErc5484(form.recipient, form.tokenId, tokenURI);
          }
          return mintToErc20(form.recipient, toWeiWithDecimals(form.amount, tokenInfo?.decimals));
        },
        onSuccess: () => loadAdditionalInfo(),
      });
    }
  });

  const isSubmitDisabled = useMemo(() => {
    return !form.isValid || !isCanMint || (isNftLike && (!isValidTokenId || isLoading));
  }, [form.isValid, isCanMint, isNftLike, isValidTokenId, isLoading]);

  const checkTokenId = async () => {
    setIsLoading(true);
    const owner = tokenInfo?.type === 'erc721'
      ? await getErc721OwnerOf(form.values.tokenId)
      : await getErc5484OwnerOf(form.values.tokenId);

    if (owner) form.setError('tokenId', t('TOKEN_ID_EXISTS_ERROR'));
    setIsValidTokenId(!owner);
    setIsLoading(false);
  };

  useEffect(() => {
    if (isNftLike && form.values.tokenId && !form.fields.tokenId.error) {
      checkTokenId();
    }
  }, [isNftLike, tokenInfo, form.values.tokenId, form.fields.tokenId.error]);

  const handleTokenUriChange = (value: string) => {
    if (!tokenInfo?.baseURI) {
      form.fields.tokenURI.onChange(value);
      return;
    }

    form.fields.tokenURI.onChange(value.startsWith(tokenInfo?.baseURI) ? value : tokenInfo.baseURI);
  };

  return (
    <StyledMintForm
      noValidate
      $isIdValid={isValidTokenId}
      onSubmit={form.submit}
    >
      <MintDetails isCanMint={isCanMint} availableMintValue={maxMintValue} />

      <Input
        {...form.fields.recipient}
        disabled={!isCanMint}
        label={t('ADDRESS')}
        placeholder={t('ADDRESS_PLACEHOLDER')}
      />
      {isNftLike
        ? (
          <>
            <Input
              {...form.fields.tokenId}
              label={t('TOKEN_ID')}
              placeholder={t('TOKEN_ID_PLACEHOLDER')}
              disabled={!isCanMint}
              prefix={Boolean(form.values.tokenId) && (
                isLoading
                  ? <Spinner />
                  : <Icon
                    className="mint-form__validation-icon"
                    name={isValidTokenId ? 'double-check' : 'cross'}
                  />
              )}
            />
            <Input
              {...form.fields.tokenURI}
              placeholder={t('TOKEN_URI_PLACEHOLDER')}
              disabled={!isCanMint}
              label={t('TOKEN_URI_OPTIONAL')}
              labelTooltip={t('TOKEN_URI_TOOLTIP')}
              onChange={handleTokenUriChange}
            />
          </>
        )
        : (
          <Input
            {...form.fields.amount}
            type="number"
            label={t('AMOUNT')}
            max={tokenInfo?.totalSupplyCap ? maxMintValue : undefined}
            prefix={tokenInfo?.symbol}
            disabled={!isCanMint}
            placeholder="0.0"
          />
        )}

      <Button
        type="submit"
        style={{ width: '100%' }}
        disabled={isSubmitDisabled}
      >
        {t('MINT')}
      </Button>
    </StyledMintForm>
  );
}

export default MintForm;
