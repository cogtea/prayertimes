<template>
  <main-layout>
    <div class="about-container">
      <div class="uk-margin-top">
        <h2 class="about-title">{{$t('app_name')}}</h2>
        <h4 class="about-subtitle">{{$t('lang.english')}} / {{$t('lang.arabic')}}</h4>
        <p class="about-description">
          {{$t('about_description')}}
        </p>
        <p class="about-description">
          {{ $t('more_details') }} <a :href="$t('github_link')" target="_blank" rel="noopener noreferrer">GitHub</a>.
        </p>
      </div>
    </div>
  </main-layout>
</template>

<script>
export default {
}
</script>

<style lang="css" scoped>
.about-container {
  padding: 20px;
  text-align: center;
}

.about-title {
  font-size: 24px;
  margin-bottom: 10px;
}

.about-subtitle {
  font-size: 18px;
  color: #555;
  margin-bottom: 20px;
}

.about-description {
  font-size: 16px;
  line-height: 1.6;
  color: #333;
  margin-bottom: 15px;
}

.about-description a {
  color: #007bff;
  text-decoration: none;
  font-weight: bold;
}

.about-description a:hover {
  text-decoration: underline;
}
</style>
