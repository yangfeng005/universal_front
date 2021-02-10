<template>
  <process-list :readonly="true"></process-list>
</template>
<script>
import ProcessList from '@/components/Process/List';

export default {
  name: 'ProcessDefinition',
  components: { ProcessList },
};
</script>
