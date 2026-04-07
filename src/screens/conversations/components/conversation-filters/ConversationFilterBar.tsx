import React, { useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { selectAllInboxes } from '@/store/inbox/inboxSelectors';
import { BottomSheetType, setBottomSheetState } from '@/store/conversation/conversationHeaderSlice';
import { selectFilters } from '@/store/conversation/conversationFilterSlice';
import { selectCurrentUserAccount } from '@/store/auth/authSelectors';
import { selectAssignableAgents } from '@/store/assignable-agent/assignableAgentSelectors';
import { BaseFilterOption, FilterBar } from '@/components-next';
import { AssigneeOptions, StatusOptions, SortOptions } from '@/types/common/ConversationStatus';
import { Agent } from '@/types';
import i18n from '@/i18n';

export const ConversationFilterOptions: BaseFilterOption[] = [
  {
    type: 'assignee_type',
    options: AssigneeOptions,
    defaultFilter: 'All',
  },
  {
    type: 'status',
    options: StatusOptions,
    defaultFilter: 'Open',
  },
  {
    type: 'sort_by',
    options: SortOptions,
    defaultFilter: 'Latest',
  },
];

export const ConversationFilterBar = () => {
  const dispatch = useAppDispatch();
  const inboxes = useAppSelector(selectAllInboxes);
  const selectedFilters = useAppSelector(selectFilters);
  const currentUserAccount = useAppSelector(selectCurrentUserAccount);
  const assignableAgentsMap = useAppSelector(selectAssignableAgents);

  const isAdmin = currentUserAccount?.role === 'administrator';

  const getInboxOptions = (inboxes: { id: number; name: string }[]) => {
    const options: Record<string, string> = {
      '0': i18n.t('FILTER.ALL_INBOXES'),
    };
    inboxes.forEach(inbox => {
      options[inbox.id] = inbox.name;
    });
    return options;
  };

  const assignableAgentsOptions = useMemo(() => {
    const agentsMap: Record<string, string> = {
      '0': 'Todos los agentes',
    };
    const uniqueAgents = new Map<number, Agent>();
    Object.values(assignableAgentsMap).flat().forEach(agent => {
      if (agent) {
         uniqueAgents.set(agent.id, agent);
      }
    });

    Array.from(uniqueAgents.values()).forEach(agent => {
      agentsMap[agent.id.toString()] = agent.name || '';
    });
    return agentsMap;
  }, [assignableAgentsMap]);

  const dynamicFilterOptions = [
    ...ConversationFilterOptions,
    {
      type: 'inbox_id' as const,
      options: getInboxOptions(inboxes),
      defaultFilter: i18n.t('FILTER.ALL_INBOXES'),
    },
  ];

  if (isAdmin) {
    dynamicFilterOptions.push({
      type: 'assignee_id' as const,
      options: assignableAgentsOptions as any,
      defaultFilter: 'Todos los agentes',
    });
  }

  const handleFilterButtonPress = (type: string) => {
    dispatch(setBottomSheetState(type as BottomSheetType));
  };

  return (
    <FilterBar
      allFilters={dynamicFilterOptions}
      selectedFilters={selectedFilters}
      onFilterPress={handleFilterButtonPress}
    />
  );
};
