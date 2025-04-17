import type en from '@/public/translations/en.json';
import { NestedKeyOf } from '@/types/helpers';

export type Translations = typeof en;

export type TranslationKey = NestedKeyOf<Translations>;