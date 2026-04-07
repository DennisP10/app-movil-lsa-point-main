import React from 'react';
import { Pressable } from 'react-native';
import Animated from 'react-native-reanimated';
import { BottomSheetView } from '@gorhom/bottom-sheet';

import { useRefsContext } from '@/context';
import { tailwind } from '@/theme';
import { ConversationPriority, PriorityOptions } from '@/types';
import { getPriorityIcon, useHaptic } from '@/utils';
import { BottomSheetHeader, Icon } from '@/components-next';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { selectSelectedConversation, selectSingleConversation } from '@/store/conversation/conversationSelectedSlice';
import { conversationActions } from '@/store/conversation/conversationActions';
import { updateConversation } from '@/store/conversation/conversationSlice';

import i18n from '@/i18n';
import { TickIcon, NoPriorityIcon } from '@/svg-icons';
import { CONVERSATION_EVENTS } from '@/constants/analyticsEvents';
import { showToast } from '@/utils/toastUtils';
import AnalyticsHelper from '@/utils/analyticsUtils';

type PriorityCellProps = {
  value: {
    id: string | null;
    icon: React.ReactElement | null;
  };
  isLastItem: boolean;
  selectedPriority: ConversationPriority | undefined;
  onPress: () => void;
};

const PriorityList = [
  { id: null, icon: <NoPriorityIcon /> },
  { id: 'low', icon: getPriorityIcon('low') },
  { id: 'medium', icon: getPriorityIcon('medium') },
  { id: 'high', icon: getPriorityIcon('high') },
  { id: 'urgent', icon: getPriorityIcon('urgent') },
];

const priorityTranslations: Record<string, string> = {
  none: 'Ninguna',
  low: 'Bajo',
  medium: 'Medio',
  high: 'Alto',
  urgent: 'Urgente',
};

const PriorityCell = (props: PriorityCellProps) => {
  const { value, isLastItem, onPress, selectedPriority } = props;
  return (
    <Pressable onPress={() => onPress()} style={tailwind.style('flex flex-row items-center')}>
      <Animated.View>
        <Icon icon={value.icon} size={24} />
      </Animated.View>
      <Animated.View
        style={tailwind.style(
          'flex-1 ml-3 flex-row justify-between py-[11px] pr-3',
          !isLastItem ? 'border-b-[1px] border-blackA-A3' : '',
        )}>
        <Animated.Text
          style={tailwind.style(
            'text-base text-gray-950 font-inter-420-20 leading-[21px] tracking-[0.16px] capitalize',
          )}>
          {value.id ? (priorityTranslations[value.id] || value.id) : 'Ninguna'}
        </Animated.Text>
        {selectedPriority === value.id ? <Icon icon={<TickIcon />} size={20} /> : null}
      </Animated.View>
    </Pressable>
  );
};

export const UpdatePriority = () => {
  const { actionsModalSheetRef } = useRefsContext();

  const dispatch = useAppDispatch();
  const selectedConversation = useAppSelector(selectSelectedConversation);

  const hapticSelection = useHaptic();

  const handlePriorityPress = async (priority: ConversationPriority) => {
    hapticSelection?.();
    if (!selectedConversation?.id) return;

    const updatedConversation = { ...selectedConversation, priority };
    dispatch(selectSingleConversation(updatedConversation));
    dispatch(updateConversation(updatedConversation));

    await dispatch(
      conversationActions.togglePriority({
        conversationId: selectedConversation?.id,
        priority,
      }),
    );
    AnalyticsHelper.track(CONVERSATION_EVENTS.PRIORITY_CHANGED);
    showToast({
      message: i18n.t('CONVERSATION.PRIORITY_CHANGE'),
    });
    actionsModalSheetRef.current?.dismiss({ overshootClamping: true });
  };

  return (
    <BottomSheetView>
      <BottomSheetHeader headerText={i18n.t('CONVERSATION.CHANGE_PRIORITY')} />
      <Animated.View style={tailwind.style('py-1 pl-3')}>
        {PriorityList.map((value, index) => (
          <PriorityCell
            key={index}
            {...{ value, isLastItem: index === PriorityList.length - 1 }}
            onPress={() => handlePriorityPress(value.id as ConversationPriority)}
            selectedPriority={selectedConversation?.priority}
          />
        ))}
      </Animated.View>
    </BottomSheetView>
  );
};
