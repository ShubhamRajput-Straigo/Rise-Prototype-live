import * as React from 'react';
import * as RechartsPrimitive from 'recharts';

import { cn } from '@/lib/utils';

// Format: { THEME_NAME: CSS_SELECTOR }
const THEMES = { light: '', dark: '.dark' } as const;

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode;
    icon?: React.ComponentType;
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  );
};

type ChartContextProps = {
  config: ChartConfig;
};

// Define payload type for better type safety
interface PayloadItem {
  value?: number | string;
  name?: string;
  dataKey?: string;
  payload?: Record<string, any>;
  color?: string;
  fill?: string;
  [key: string]: any;
}

const ChartContext = React.createContext<ChartContextProps | null>(null);

function useChart() {
  const context = React.useContext(ChartContext);

  if (!context) {
    throw new Error('useChart must be used within a <ChartContainer />');
  }

  return context;
}

const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'> & {
    config: ChartConfig;
    children: React.ComponentProps<
      typeof RechartsPrimitive.ResponsiveContainer
    >['children'];
  }
>(({ id, className, children, config, ...props }, ref) => {
  const uniqueId = React.useId();
  const chartId = `chart-${id || uniqueId.replace(/:/g, '')}`;

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-chart={chartId}
        ref={ref}
        className={cn(
          // Made responsive for all screen sizes
          "flex w-full h-full min-h-[200px] aspect-video justify-center text-xs",
          "sm:min-h-[250px] md:min-h-[300px] lg:min-h-[350px] xl:min-h-[400px]",
          "2xl:min-h-[450px]",
          "[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground", 
          "[&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50", 
          "[&_.recharts-curve.recharts-tooltip-cursor]:stroke-border", 
          "[&_.recharts-dot[stroke='#fff']]:stroke-transparent", 
          "[&_.recharts-layer]:outline-none", 
          "[&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border", 
          "[&_.recharts-radial-bar-background-sector]:fill-muted", 
          "[&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted", 
          "[&_.recharts-reference-line_[stroke='#ccc']]:stroke-border", 
          "[&_.recharts-sector[stroke='#fff']]:stroke-transparent", 
          "[&_.recharts-sector]:outline-none", 
          "[&_.recharts-surface]:outline-none",
          className
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer width="100%" height="100%">
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
});
ChartContainer.displayName = 'Chart';

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(
    ([, itemConfig]) => itemConfig.theme || itemConfig.color
  );

  if (!colorConfig.length) {
    return null;
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, itemConfig]) => {
    const color =
      itemConfig.theme?.[theme as keyof typeof itemConfig.theme] ||
      itemConfig.color;
    return color ? `  --color-${key}: ${color};` : null;
  })
  .join('\n')}
}
`
          )
          .join('\n'),
      }}
    />
  );
};

const ChartTooltip = RechartsPrimitive.Tooltip;

interface ChartTooltipContentProps extends 
  Omit<React.ComponentProps<typeof RechartsPrimitive.Tooltip>, 'content'>,
  React.ComponentProps<'div'> {
  hideLabel?: boolean;
  hideIndicator?: boolean;
  indicator?: 'line' | 'dot' | 'dashed';
  nameKey?: string;
  labelKey?: string;
  active?: boolean;
  payload?: PayloadItem[];
  label?: string | number;
}

const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  ChartTooltipContentProps
>(
  (
    {
      active,
      payload = [],
      className,
      indicator = 'dot',
      hideLabel = false,
      hideIndicator = false,
      label,
      labelFormatter,
      labelClassName,
      formatter,
      color,
      nameKey,
      labelKey,
      ...props
    },
    ref
  ) => {
    const { config } = useChart();

    const tooltipLabel = React.useMemo(() => {
      if (hideLabel || !payload?.length) {
        return null;
      }

      const [item] = payload;
      const key = `${labelKey || item.dataKey || item.name || 'value'}`;
      const itemConfig = getPayloadConfigFromPayload(config, item, key);
      const value =
        !labelKey && typeof label === 'string'
          ? config[label as keyof typeof config]?.label || label
          : itemConfig?.label;

      if (labelFormatter) {
        return (
          <div className={cn('font-medium text-xs sm:text-sm', labelClassName)}>
            {labelFormatter(value, payload)}
          </div>
        );
      }

      if (!value) {
        return null;
      }

      return <div className={cn('font-medium text-xs sm:text-sm', labelClassName)}>{value}</div>;
    }, [
      label,
      labelFormatter,
      payload,
      hideLabel,
      labelClassName,
      config,
      labelKey,
    ]);

    if (!active || !payload?.length) {
      return null;
    }

    const nestLabel = payload.length === 1 && indicator !== 'dot';

    return (
      <div
        ref={ref}
        className={cn(
          'grid min-w-[6rem] sm:min-w-[8rem] items-start gap-1 sm:gap-1.5',
          'rounded-lg border border-border/50 bg-background',
          'px-2 py-1 sm:px-2.5 sm:py-1.5',
          'text-xs shadow-xl max-w-[90vw] sm:max-w-none',
          className
        )}
        {...props}
      >
        {!nestLabel ? tooltipLabel : null}
        <div className="grid gap-1 sm:gap-1.5">
          {payload.map((item: PayloadItem, index: number) => {
            const key = `${nameKey || item.name || item.dataKey || 'value'}`;
            const itemConfig = getPayloadConfigFromPayload(config, item, key);
            const indicatorColor = color || item.payload?.fill || item.color;

            return (
              <div
                key={item.dataKey || index}
                className={cn(
                  'flex w-full flex-wrap items-stretch gap-1.5 sm:gap-2',
                  '[&>svg]:h-2 [&>svg]:w-2 sm:[&>svg]:h-2.5 sm:[&>svg]:w-2.5',
                  '[&>svg]:text-muted-foreground',
                  indicator === 'dot' && 'items-center'
                )}
              >
                {formatter && item?.value !== undefined && item.name ? (
                  formatter(item.value, item.name, item, index, Array.isArray(item.payload) ? item.payload : [])
                ) : (
                  <>
                    {itemConfig?.icon ? (
                      <itemConfig.icon />
                    ) : (
                      !hideIndicator && (
                        <div
                          className={cn(
                            'shrink-0 rounded-[2px] border-[--color-border] bg-[--color-bg]',
                            {
                              'h-2 w-2 sm:h-2.5 sm:w-2.5': indicator === 'dot',
                              'w-0.5 sm:w-1': indicator === 'line',
                              'w-0 border-[1.5px] border-dashed bg-transparent':
                                indicator === 'dashed',
                              'my-0.5': nestLabel && indicator === 'dashed',
                            }
                          )}
                          style={
                            {
                              '--color-bg': indicatorColor,
                              '--color-border': indicatorColor,
                            } as React.CSSProperties
                          }
                        />
                      )
                    )}
                    <div
                      className={cn(
                        'flex flex-1 justify-between leading-none',
                        nestLabel ? 'items-end' : 'items-center'
                      )}
                    >
                      <div className="grid gap-1 sm:gap-1.5">
                        {nestLabel ? tooltipLabel : null}
                        <span className="text-muted-foreground text-xs">
                          {itemConfig?.label || item.name}
                        </span>
                      </div>
                      {item.value && (
                        <span className="font-mono font-medium tabular-nums text-foreground text-xs sm:text-sm">
                          {typeof item.value === 'number' 
                            ? item.value.toLocaleString() 
                            : item.value
                          }
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);
ChartTooltipContent.displayName = 'ChartTooltip';

const ChartLegend = RechartsPrimitive.Legend;

interface ChartLegendContentProps extends React.ComponentProps<'div'> {
  payload?: PayloadItem[];
  verticalAlign?: 'top' | 'middle' | 'bottom';
  hideIcon?: boolean;
  nameKey?: string;
}

const ChartLegendContent = React.forwardRef<
  HTMLDivElement,
  ChartLegendContentProps
>(
  (
    { 
      className, 
      hideIcon = false, 
      payload = [], 
      verticalAlign = 'bottom', 
      nameKey,
      ...props 
    },
    ref
  ) => {
    const { config } = useChart();

    if (!payload?.length) {
      return null;
    }

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center justify-center',
          'gap-2 sm:gap-4 flex-wrap',
          'px-2 sm:px-0',
          verticalAlign === 'top' ? 'pb-2 sm:pb-3' : 'pt-2 sm:pt-3',
          className
        )}
        {...props}
      >
        {payload.map((item: PayloadItem, index: number) => {
          const key = `${nameKey || item.dataKey || 'value'}`;
          const itemConfig = getPayloadConfigFromPayload(config, item, key);

          return (
            <div
              key={item.value || index}
              className={cn(
                'flex items-center gap-1 sm:gap-1.5',
                '[&>svg]:h-2.5 [&>svg]:w-2.5 sm:[&>svg]:h-3 sm:[&>svg]:w-3',
                '[&>svg]:text-muted-foreground'
              )}
            >
              {itemConfig?.icon && !hideIcon ? (
                <itemConfig.icon />
              ) : (
                <div
                  className="h-2 w-2 shrink-0 rounded-[2px]"
                  style={{
                    backgroundColor: item.color,
                  }}
                />
              )}
              <span className="text-xs sm:text-sm text-foreground">
                {itemConfig?.label}
              </span>
            </div>
          );
        })}
      </div>
    );
  }
);
ChartLegendContent.displayName = 'ChartLegend';

// Helper to extract item config from a payload.
function getPayloadConfigFromPayload(
  config: ChartConfig,
  payload: unknown,
  key: string
) {
  if (typeof payload !== 'object' || payload === null) {
    return undefined;
  }

  const payloadPayload =
    'payload' in payload &&
    typeof payload.payload === 'object' &&
    payload.payload !== null
      ? payload.payload
      : undefined;

  let configLabelKey: string = key;

  if (
    key in payload &&
    typeof payload[key as keyof typeof payload] === 'string'
  ) {
    configLabelKey = payload[key as keyof typeof payload] as string;
  } else if (
    payloadPayload &&
    key in payloadPayload &&
    typeof payloadPayload[key as keyof typeof payloadPayload] === 'string'
  ) {
    configLabelKey = payloadPayload[
      key as keyof typeof payloadPayload
    ] as string;
  }

  return configLabelKey in config
    ? config[configLabelKey]
    : config[key as keyof typeof config];
}

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
};

/* 
ADDITIONAL FIXES FOR OTHER FILES:

1. HomePage.tsx:
   - Remove ShoppingCart from imports: import { BarChart3, TrendingUp, Target, Home as HomeIcon, Users, Building2, Package } from 'lucide-react';
   - Fix Link component: <Link to={action.href || '#'}>

2. OSAPage.tsx:
   - Remove useMemo from imports: import React, { useEffect, useState } from 'react';
   - Remove TrendingDown from imports: import { Package, AlertTriangle, CheckCircle } from 'lucide-react';
   - Remove unused setInventoryHealth or add it back if needed

3. RetailWalletPage.tsx:
   - Remove AreaChart, Area from imports: import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, ComposedChart } from 'recharts';
   - Remove CreditCard from imports: import { DollarSign, TrendingUp, Target } from 'lucide-react';

4. SummaryPage.tsx:
   - Remove LineChart from imports: import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line, PieChart, Pie, Cell, ComposedChart } from 'recharts';

5. SupplyChainPage.tsx:
   - Clean imports: import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, ComposedChart } from 'recharts';
   - Clean lucide imports: import { Truck, AlertTriangle, CheckCircle } from 'lucide-react';
   - Remove unused state variables or add setters back if needed
*/