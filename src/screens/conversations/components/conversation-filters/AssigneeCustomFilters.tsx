import React, { useMemo } from 'react';
import { Pressable } from 'react-native';
import Animated from 'react-native-reanimated';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';

import { useRefsContext } from '@/context';
import { TickIcon } from '@/svg-icons';
import { tailwind } from '@/theme';
import { useHaptic } from '@/utils';
import { BottomSheetHeader, Icon, Avatar } from '@/components-next';
import { selectFilters, setFilters } from '@/store/conversation/conversationFilterSlice';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { selectAssignableAgents } from '@/store/assignable-agent/assignableAgentSelectors';
import { Agent } from '@/types';
import i18n from '@/i18n';

type AssigneeCustomCellProps = {
  value: { id: number; name: string; avatarUrl: string; availabilityStatus: string };
  isLastItem: boolean;
};

const AssigneeCustomCell = (props: AssigneeCustomCellProps) => {
  const { filtersModalSheetRef } = useRefsContext();
  const dispatch = useAppDispatch();
  const { value, isLastItem } = props;

  const filters = useAppSelector(selectFilters);
  const hapticSelection = useHaptic();

  const handlePress = () => {
    hapticSelection?.();
    dispatch(setFilters({ key: 'assignee_id', value: value.id.toString() }));
    if (value.id !== 0) {
      dispatch(setFilters({ key: 'assignee_type', value: 'all' }));
    }
    setTimeout(() => filtersModalSheetRef.current?.dismiss({ overshootClamping: true }), 1);
  };

  return (
    <Pressable
      onPress={handlePress}
      style={tailwind.style('flex flex-row items-center')}>
      <Animated.View
        style={tailwind.style(
          'flex-1 ml-3 flex-row justify-between py-[11px] pr-3',
          !isLastItem ? 'border-b-[1px] border-blackA-A3' : '',
        )}>
        <Animated.View style={tailwind.style('flex-row items-center')}>
          <Avatar
            src={{ uri: value.avatarUrl || '' }}
            name={value.name || ''}
            size={'sm'}
          />

          <Animated.Text
            style={tailwind.style(
              'text-base text-gray-950 font-inter-420-20 leading-[21px] tracking-[0.16px] capitalize ml-3',
            )}>
            {value.name}
          </Animated.Text>
        </Animated.View>
        {filters.assignee_id === value.id.toString() ? <Icon icon={<TickIcon />} size={20} /> : null}
      </Animated.View>
    </Pressable>
  );
};

export const AssigneeCustomFilters = () => {
  const assignableAgentsMap = useAppSelector(selectAssignableAgents);
  
  const agentsList = useMemo(() => {
    const uniqueAgents = new Map<number, Agent>();
    Object.values(assignableAgentsMap).flat().forEach(agent => {
      if (agent) {
         uniqueAgents.set(agent.id, agent);
      }
    });

    const list = [
      {
        id: 0,
        name: i18n.t('FILTER.ALL_AGENTS') || 'Todos los agentes',
        avatarUrl: '',
        availabilityStatus: 'offline',
      },
      ...Array.from(uniqueAgents.values()).map(agent => ({
        id: agent.id,
        name: agent.name || '',
        avatarUrl: agent.thumbnail || '',
        availabilityStatus: agent.availabilityStatus || 'offline',
      })),
    ];
    return list;
  }, [assignableAgentsMap]);

  return (
    <BottomSheetScrollView
      contentContainerStyle={tailwind.style('pb-24')}
      bounces={false}
      showsVerticalScrollIndicator={true}>
      <BottomSheetHeader headerText={i18n.t('CONVERSATION.FILTERS.ASSIGNEE.TITLE') || 'Agentes'} />
      <Animated.View style={tailwind.style('pl-3 pb-4')}>
        {agentsList.map((value, index) => (
          <AssigneeCustomCell key={index} {...{ value, index, isLastItem: index === agentsList.length - 1 }} />
        ))}
      </Animated.View>
    </BottomSheetScrollView>
  );
};
