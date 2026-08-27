import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import { Tab, Tabs } from 'fumadocs-ui/components/tabs';
import { Callout } from 'fumadocs-ui/components/callout';
import { Step, Steps } from 'fumadocs-ui/components/steps';
import { TypeTable } from 'fumadocs-ui/components/type-table';
import { Accordion, Accordions } from 'fumadocs-ui/components/accordion';
import { Card, Cards } from 'fumadocs-ui/components/card';
import { File, Folder, Files } from 'fumadocs-ui/components/files';

// Custom Interactive AddisPay Dev-Doc Components
import {
  ApiPlayground,
  WebhookTester,
  SignatureGenerator,
  QrCodeGenerator,
  SdkSelector,
  ProviderBadgeGrid,
  EndpointBadge,
  ResponseViewer,
} from '@/components/dev-doc';

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    Tab,
    Tabs,
    Callout,
    Step,
    Steps,
    TypeTable,
    Accordion,
    Accordions,
    Card,
    Cards,
    File,
    Folder,
    Files,
    ApiPlayground,
    WebhookTester,
    SignatureGenerator,
    QrCodeGenerator,
    SdkSelector,
    ProviderBadgeGrid,
    EndpointBadge,
    ResponseViewer,
    ...components,
  };
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
