
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useForm } from '@q-dev/form-hooks';
import { providers } from 'ethers';
import { NewProposalForm } from 'typings/forms';

import Button from 'components/Button';
import Input from 'components/Input';
import { FormStep } from 'components/MultiStepForm';

import { useNewProposalForm } from '../NewProposalForm';

import { downloadJSON } from 'utils/download';
import { buildTree, createLeafNodes } from 'utils/merkletree';
import { toBN, wei } from 'utils/numbers';
import { parameterType, required } from 'utils/validators';

function AirDropV2DetailsStep () {
  const [startTimestamp, setStartTimestamp] = useState<any>();
  const [endTimestamp, setEndTimestamp] = useState<any>();

  useEffect(() => {
    const fetchBlock = async () => {
      const provider = new providers.JsonRpcProvider('https://rpc.qtestnet.org');

      // Fetch the latest block number.
      const blockNumber = await provider.getBlockNumber();

      // Fetch the block details.
      const startTimestamp = toBN((await provider.getBlock(blockNumber)).timestamp).plus(500).toString();
      const endTimestamp = toBN((await provider.getBlock(blockNumber)).timestamp).plus(5000).toString();
      setStartTimestamp(startTimestamp);
      setEndTimestamp(endTimestamp);
    };

    fetchBlock();
  }, []);
  const { t } = useTranslation();
  const { goNext, goBack } = useNewProposalForm();

  const [dynamicAddresses, setDynamicAddresses] = useState<string[]>([]);
  const [newAddress, setNewAddress] = useState('');
  const [addressError, setAddressError] = useState<string | null>(null);

  const getMerkleRoot = () => {
    const leafNodes = createLeafNodes(dynamicAddresses);
    const merkleTree = buildTree(leafNodes);

    // Exporting the tree as JSON
    const data = {
      addresses: dynamicAddresses.map((address) => address),
      leafNodes: leafNodes,
      root: merkleTree.getHexRoot(),
    };

    downloadJSON(data, 'tree.json');
    return merkleTree.getHexRoot();
  };

  const form = useForm({
    initialValues: {
      rewardToken: '',
      amount: 1
    },
    validators: {
      rewardToken: [required],
      amount: [required]
    },

    onSubmit: async (form) => {
      if (dynamicAddresses.length < 2) {
        setAddressError('Please provide at least 2 addresses.');
        return; // Exit early so the form doesn't proceed
      }
      const merkleRoot = getMerkleRoot();
      const rewardAmount = wei(form.amount);
      const updatedFormValues = { ...form, merkleRoot, startTimestamp, endTimestamp, rewardAmount };
      goNext(updatedFormValues as NewProposalForm);
    },
  });

  return (
    <FormStep
      disabled={!form.isValid}
      onNext={form.submit}
      onBack={goBack}
    >

      <Input
        value={form.fields.rewardToken.value || ''}
        label={t('Reward Token Address')}
        placeholder={t('Enter reward token address')}
        error={form.fields.rewardToken.error}
        onChange={form.fields.rewardToken.onChange}
      />

      <Input
        value={form.fields.amount.value || ''}
        label={t('Reward Amount')}
        placeholder={t('Enter reward amount')}
        type="number"
        error={form.fields.amount.error}
        onChange={form.fields.amount.onChange}
      />

      {/* Dynamic addresses list */}
      {dynamicAddresses.map((address, index) => (
        <div key={index}>
          <span>{address}</span>
          {/* 4. Delete option */}
          <Button
            icon
            compact
            look="ghost"
            // className={className}
            onClick={() => {
              const newAddresses = [...dynamicAddresses];
              newAddresses.splice(index, 1);
              setDynamicAddresses(newAddresses);
            }}
          >
            Remove
          </Button>
        </div>
      ))}

      {/* 3. Input to add new address */}
      <Input
        value={newAddress}
        label={t('Enter New Address')}
        placeholder="Enter new address"
        hint={'Enter at least 2 addresses to create a Merkle Tree'}
        onChange={value => setNewAddress(value)}
      />

      <Button
        icon
        compact
        look="ghost"
        // className={className}
        onClick={() => {
          if (newAddress) {
            setDynamicAddresses(prev => [...prev, newAddress]);
            setNewAddress(''); // Clear the input
          }
        }}
      >
        Add Address
      </Button>
      {addressError && <p style={{ color: 'red' }}>{addressError}</p>}

    </FormStep>
  );
}

export default AirDropV2DetailsStep;
