<template>
  <div class="uk-text-center" uk-grid>
    <div class="uk-card uk-card-default uk-card-body uk-width-1-3 uk-height-1-1">
        <ul class="uk-nav-default uk-nav-parent-icon" uk-nav>
            <li class="uk-active uk-text-center uk-margin-bottom"><a href="#">{{$t('app_name')}}</a></li>
            <li class="uk-text-left"><router-link to="/"><span class="uk-margin-small-right" uk-icon="icon: clock"></span> {{$t('timing')}}</router-link></li>
            <li class="uk-text-left"><router-link to="/settings"><span class="uk-margin-small-right" uk-icon="icon: cog"></span> {{$t('settings')}}</router-link></li>
            <li class="uk-nav-divider"></li>
            <li class="uk-text-left"><router-link to="/about"><span class="uk-margin-small-right" uk-icon="icon: info"></span> {{$t('about')}}</router-link></li>
        </ul>
    </div>
    
    <div class="uk-width-2-3">
      <slot></slot>
    </div>
    
  </div>
</template>

<script>
export default {
}
</script>

<style lang="css" scoped>
</style>
