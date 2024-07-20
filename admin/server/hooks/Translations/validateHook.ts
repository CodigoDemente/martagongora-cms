import { BaseListTypeInfo } from '@keystone-6/core/types';

export default function validateHook({
	resolvedData,
	addValidationError
}: {
	resolvedData: BaseListTypeInfo['prisma']['update'];
	addValidationError: (errror: string) => void;
}) {
	if (!resolvedData?.key || !resolvedData?.value) {
		addValidationError('Both key and value are required');
	}
}
