import type { nameLimitsType, numberLimitsType } from '@types';

interface namePartFormPropsType {
  instanceId: string;
  limits: nameLimitsType;
  placeholder: string;
}

interface numberPartFormPropsType {
  instanceId: string;
  limits: numberLimitsType;
  placeholder: string;
}

interface partColorControlPropsType {
  partId: string;
}

type filePickContextUploadType = { mode: 'upload' };
type filePickContextReplaceType = { mode: 'replace'; partId: string };
type filePickContextType = filePickContextUploadType | filePickContextReplaceType;

export type { filePickContextType, namePartFormPropsType, numberPartFormPropsType, partColorControlPropsType };
