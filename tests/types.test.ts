import { NodestyApiClient, type VirtualServerUpdateBackupData } from '../src';

const backupPath: VirtualServerUpdateBackupData['path'] = {
    id: 'service-id',
    file: 'backup.tar.gz',
};

void backupPath;

const verifyFacadeTypes = (client: NodestyApiClient) => {
    void client.user.getCurrentUser();
    void client.billing.addOrder('group-id', 'product-id', {
        domain: 'example.com',
        billingCycle: 'Monthly',
    });
    void client.virtualServer.performAction('service-id', { action: 'start' });
};

void verifyFacadeTypes;
