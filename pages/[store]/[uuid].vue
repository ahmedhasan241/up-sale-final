<template>
  <div class="main-contain relative">
    <div class="header-contain flex flex-row justify-center align-middle text-center">
      <img :src="campaignInfo.store_logo" alt="" />
    </div>
    <div class="products-contain" v-if="isLoading">
      <ProgressSpinner />
    </div>

    <template v-else>
      <div v-if="route.query.id && route.query.message">
        <div class="alert alert-warning text-center">{{ route.query.message }}</div>
      </div>
      <div v-if="!campaignInfo.id" class="alert alert-danger text-center">
        الحملة غير موجودة
      </div>
      <template v-else>
        <div class="products-contain" :class="showModal ? 'overflow-hidden' : '' ">
          <div class="first-section pb-4 flex flex-col gap-3">
            <div class="image-contain mt-3 flex justify-center align-middle text-center">
              <v-container
              v-if="selectedCardData && selectedCardData?.slider.length > 0">
                <!-- Check if selectedCardData and its slider array exist and have slides -->
                <v-carousel
                
                  v-model="currentSlide"
                  hide-delimiters
                  :continuous="true"
                  :show-arrows="false"
                  :cycle="true"
                  :interval="3000"
                  class="custom-carousel w-full h-full"
                >
                  <!-- Loop through the slides -->
                  <v-carousel-item
                    v-for="(card, index) in selectedCardData?.slider"
                    :key="index"
                    class=""
                  >
                    <v-img :src="card" class="mx-auto image-width" alt="" />
                  </v-carousel-item>
                </v-carousel>

                <!-- Pagination outside the carousel -->
                <div class="pagination-container">
                  <span
                    v-for="(card, index) in selectedCardData?.slider"
                    :key="index"
                    @click="currentSlide = index"
                    :class="['pagination-dot', { active: currentSlide === index }]"
                  ></span>
                </div>
              </v-container>
              <div
                v-if="selectedCardData && selectedCardData?.slider.length === 0"
                class="image-container w-full"
              >
                <img :src="selectedCardData?.cover" class="mx-auto w-full image-width" alt="" />
              </div>

              <div class="h-28 flex" v-if="!selectedCardData">
                <h2 class="my-auto font-bold">إختر منتج أولا</h2>
              </div>
            </div>
            <!-- <div v-if="selectedCardData" class="flex flex-row justify-center">
              <h2 class="font-almarai text-[8px] font-bold leading-[9.6px] text-center">
                {{ selectedCardData.name_ar }}
              </h2>
            </div> -->
          </div>
          <Swiper
            :slides-per-view="2.3"
            space-between="10"
            centered-slides="true"
            :breakpoints="{
              320: {
                slidesPerView: 1.7,
                spaceBetween: 0.5,
              },
              419: {
                slidesPerView: 2,
                spaceBetween: 0.5,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 0,
              },
              1024: {
                slidesPerView: 2.3,
                spaceBetween: 10,
              },
            }"
            class="mySwiper h-60 pt-2 my-6"
            @slideChange="onSlideChange"
            @swiper="onSwiperInit"
          >
            <SwiperSlide
              v-for="(card, index) in cards"
              :key="card.id"
              class="swiper-slide card-slider my-auto"
              :data-swiper-slide-index="index"
            >
              <ProductCard
                :card="card"
                :selected="selectedCardId"
                @click="selectCard(card, true)"
              />
            </SwiperSlide>
          </Swiper>

          <div class="px-3 lg:px-5 " ref="detailsContent" v-if="selectedCardData">
            <div class="!w-full">
              <div
                class="flex !w-full border-b pb-4 justify-around !px-0 lg:!px-5 border-box"
              >
                <button
                  v-for="(tab, index) in tabs"
                  :key="index"
                  @click="selectTab(index)"
                  :class="[
                    'relative cursor-pointer flex flex-row justify-center items-center gap-1 px-4 py-2',
                    currentTab === index ? 'active-tab' : 'inactive-tab',
                  ]"
                >
                <Icon name="tabler:live-photo" v-if="index === 4" :class="currentTab === 4 ? 'text-red-700' : ''"  class=" text-xl"/>
                  {{ tab.title }}
              
                  <span
                    v-if="index !== 0 && index !== 1 && index !== 4"
                    class="counter-tab absolute -top-[2px] -right-[2px] bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full p-1"
                  >
                    {{ tab.count }}
                  </span>
                </button>
              </div>
              <div class="tab-content mt-3">
                <div v-if="currentTab === 0"  class="details-content">
                  <ProductFirstTap :selected="selectedCardData" />
                </div>
                <div v-if="currentTab === 4"  class="details-content">
                  <div
                  v-if="campaignInfo?.direct"
                  class="description !mx-w-[400px] !max-h-[800px]"
                  v-html="campaignInfo?.direct"
              ></div>
                </div>
                <div v-if="currentTab === 1"  class="details-content">
             
                    <div
                    class="mt-4 flex justify-center bg-gray-200 rounded-md py-4"
                v-if="selectedCardData.views === 0"
                  >
                    <h2 class="text-lg text-black text-bold">لا يوجد صور</h2>
                  </div>
                  <div v-else class="grid grid-cols-4 gap-1">
                    <ImageComponent v-for="(img, index) in selectedCardData.views" :key="index" :image="img" />
                  </div>
                </div>
                <div v-if="currentTab === 2" class="details-content">
                  <div
                    class="mt-4 flex justify-center bg-gray-200 rounded-md py-4"
                    v-if="userComments.length === 0"
                  >
                    <h2 class="text-lg text-black text-bold">لا يوجد تعليقات</h2>
                  </div>
                  <div
                    v-else
                    class="min-h-56 mx-auto w-[100%] md:w-[95%] mt-3 rounded-lg"
                  >
                    <div class="flex flex-row gap-2">
                      <h2
                        class="text-gray-500 bg-gray-50 rounded-[4px] py-2 px-2 my-auto text-[12px] font-almarai text-xs font-bold leading-3"
                      >
                        {{ userComments.length }} تعليق
                      </h2>
                      <button
                        @click="toggleSort"
                        class="text-gray-500 bg-gray-50 rounded-[4px] py-1 px-2 my-auto text-[12px] font-almarai text-xs font-bold leading-3"
                      >
                        <Icon
                          name="mage:filter"
                          class="!text-gray-500 !text-[16px] my-auto"
                        />
                        <!-- {{ sortButtonText }} -->
                      </button>
                    </div>

                    <div class="mt-6 flex flex-col">
                      <div
                        v-for="(comment, index) in userComments"
                        :key="index"
                        class="mb-6 px-2"
                      >
                        <div class="grid grid-cols-5">
                          <div class="col-span-2 flex flex-row gap-2">
                            <div
                              class="!w-8 !h-8 my-auto rounded-full flex items-center justify-center !bg-[#EAEAEA] !text-[#A1A1A1]"
                            >
                              <Icon
                                name="material-symbols:person"
                                class="text-2xl"
                              ></Icon>
                            </div>
                            <div class="my-auto flex flex-col !justify-start gap-1">
                              <h2
                                class="font-almarai text-[10px] !text-start font-bold leading-[12px]"
                              >
                                {{ comment.client_name }}
                              </h2>
                              <div class="flex justify-start">
                                <Rating
                                  v-model="comment.rating"
                                  readonly
                                  class="text-[rgba(255,228,0,1)] text-[7px] my-auto"
                                />
                              </div>
                            </div>
                          </div>
                          <div class="col-span-2 my-auto">
                            <h2 class="flex flex-row-reverse gap-1">
                              <span
                                class="text-gray-600 font-almarai text-[10px] md:text-xs font-normal leading-2 tracking-tight text-right"
                              >
                                قام بالشراء , تم التقييم
                              </span>
                              <Icon
                                name="material-symbols:check-circle"
                                class="text-[11px] md:!text-[14px] !text-blue-400 !border-0 my-auto"
                              />
                            </h2>
                          </div>
                          <div class="my-auto">
                            <h2
                              class="text-gray-600 font-almarai text-[10px] md:text-xs font-normal leading-2 tracking-tight text-left"
                            >
                              {{ comment.created_at }}
                            </h2>
                          </div>
                        </div>
                        <div>
                          <h2
                            class="mt-3 text-[rgba(140,140,140,1)] font-almarai text-[10px] font-normal leading-[12px] tracking-[0.0024em] text-right"
                          >
                            {{ comment.comment }}
                          </h2>
                        </div>
                      </div>

                      <!-- <div v-if="!showLoadMoreButton" class="flex justify-center my-3">
                        <button
                          @click="loadMoreComments"
                          class="bg-black p-2 rounded-md text-white font-almarai text-xs font-bold leading-2 tracking-tight text-center"
                        >
                          تحميل المزيد
                        </button>
                      </div> -->
                    </div>
                  </div>
                </div>
                <div v-if="currentTab === 3" class="details-content">
                  <div
                    class="mt-4 flex justify-center bg-gray-200 rounded-md py-4"
                    v-if="usersReviews.length === 0"
                  >
                    <h2 class="text-lg text-black text-bold">لا يوجد مراجعات</h2>
                  </div>
                  <div v-else>
                    <!-- {{ usersReviews }} -->
                    <div class="grid grid-cols-3 gap-[6px] md:gap-4 pb-16">
                      <div
                      v-for="card in usersReviews"
                      :key="card.id"
                      class="group w-full h-full rounded-lg relative mt-3"
                    >
                      <div class="relative w-full !h-[300px] rounded-lg overflow-hidden group">
                        <canvas
                          ref="canvas"
                          class="thumbnail-canvas absolute inset-0 transition-opacity duration-300 group-hover:opacity-0"
                          style="display: block"
                        ></canvas>
                  
                        <video
                          class="video w-full !h-[300px] object-cover rounded-lg video-height overflow-hidden"
                          controls
                          :id="card.id"
                          v-if="card.video || (card.video && card.image)"
                          loop
                          ref="video"
                          @play="handlePlay(card.id)" 
                          @pause="handlePause(card.id)"
                        >
                          <source :src="card.video" type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                  
                        <img
                          v-if="!(card.video || (card.video && card.image))"
                          :src="card.image"
                          :id="card.id"
                          class=" w-full !h-[300px] object-cover rounded-lg overflow-hidden"
                          alt=""
                        />
                      </div>
                  
                      <div
                        class="absolute !h-[300px] top-0 bottom-0 right-0 left-0 rounded-lg bg-gradient-custom overflow-hidden pointer-events-none group-hover:opacity-0 transition-opacity duration-300"
                      >
                        <div
                          class="flex flex-col gap-1 right-1 md:right-3 bottom-3 md:bottom-10 absolute rounded-lg"
                        >
                          <div class="flex justify-start mt-52">
                            <Rating
                              v-model="card.rating"
                              readonly
                              class="text-[rgba(255,228,0,1)] text-[5px] md:text-[7px] my-auto"
                            />
                          </div>
                          <h2
                            class="text-[rgba(161,161,161,1)] font-almarai text-[8px] md:text-[12px] font-bold leading-[14.4px]"
                          >
                            {{ card.client_name }}
                          </h2>
                        </div>
                      </div>
                    </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- Start Footer  -->
              <div class="my-10 py-2 rounded-lg bg-gray-100">
                <div
                  class="text-center mb-6 footer-styles"
                  v-html="campaignInfo?.store_footer_settings"
                ></div>

                <div class="flex justify-center mb-4 gap-6">
                  <div
                    v-for="(platform, index) in socialLinks"
                    :key="index"
                    class="flex items-center justify-center"
                  >
                    <a
                      :href="platform.url"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="flex items-center gap-2 space-x-2"
                    >
                      <!-- screen-reader only for accessibility -->
      
              
                
                  
              
                      <v-btn
                      v-if="platform?.name === 'twitter'"
                      icon
                      class="icon-btn"
                    >
                    <Icon
                    v-if="platform?.name === 'twitter'"
                    name="mingcute:social-x-fill"
                    class="text-xl"
                  />
                    </v-btn>
                    <v-btn
                      v-if="platform?.name === 'facebook'"
                      icon
                      class="icon-btn"
                    >
                    <Icon
                    v-if="platform?.name === 'facebook'"
                    name="line-md:facebook"
                    class="text-xl"
                  />
                    </v-btn>
                    <v-btn
                      v-if="platform?.name === 'instagram'"
                      icon
                      class="icon-btn"
                    >
                    <Icon
                    v-if="platform?.name === 'instagram'"
                    name="mdi:instagram"
                    class="text-xl"
                  />
                    </v-btn>
                    <v-btn
                      v-if="platform?.name === 'youtube'"
                      icon
                      class="icon-btn text-2xl"
                    >
                    <Icon
                    v-if="platform?.name === 'youtube'"
                    name="mdi:youtube"
                    class="text-2xl"
                  />
                    </v-btn>
                    <v-btn
                      v-if="platform?.name === 'snapchat'"
                      icon
                      class="icon-btn text-2xl"
                    >
                    <Icon
                    v-if="platform?.name === 'snapchat'"
                    name="ic:baseline-snapchat"
                    class="text-2xl"
                  />
                    </v-btn>
                    </a>
                  </div>
                </div>
              </div>

              <!-- End Footer  -->
            </div>
          </div>
        </div>
        <div class="footer-contain fixed bottom-0 inset-x-0 z-10 !px-8 md:!px-5 py-[6px]">
          <button
            class="btn-Buy bg-black shadow-lg my-auto py-[12px] text-white flex items-center justify-center rounded-lg font-almarai text-[12px] font-bold leading-[14.4px]"
            @click="toggleModal"
          >
          {{ campaignInfo?.payment_button_word }} 
          </button>

          <div
            v-if="showModal"
            :class="[
              'fixed modal inset-0 z-50 flex items-end justify-center bg-gray-200 bg-opacity-20',
              modalAnimationClass,
            ]"
          >
            <!-- Modal Content -->
            <div
              class="!w-full md:!w-full rounded-t-[24px] modal-contain bg-white py-3 z-50"
              @click.stop
            >
              <!-- Modal content -->
              <div class="flex header-modal flex-row px-6 mb-3 justify-between">
                <v-dialog
                  v-model="isMartDialogVisible"
                  transition="dialog-top-transition"
                  max-width="500px"
                  min-height="450px"
                  class="dialog-contain"
                >
                  <!-- Activator Slot -->
                  <template v-slot:activator="{ props: activatorProps }">
                    <div
                      v-bind="activatorProps"
                      class="mart-contain"
                      @click="visiblePopupMart"
                    >
                      <v-badge
                        class="badge-counter"
                        color="rgba(234, 0, 27, 1)"
                        :content="martNumber"
                      >
                      </v-badge>
                      <Icon
                        name="material-symbols:shopping-cart-outline-rounded"
                        class="!text-black !text-[18px] my-auto"
                      />
                    </div>
                  </template>

                  <!-- Dialog Content -->
                  <template v-slot:default="{ isActive }">
                    <PaymentDetails
                      :selectedCardData="selectedCardData"
                      :selectedBundles="selectedBundles"
                      :selectedGifts="selectedGifts"
                      :discountAmount="discountAmount"
                      :selectedCityData="selectedCityData"
                      :totalOrderPrice="totalOrderPrice"
                      :totalOrderPriceAfterDiscount="totalOrderPriceAfterDiscount"
                      :hasDiscountInGifts="hasDiscountInGifts"
                      :showDelivery="showDelivery"
                      :isDisabled="isDisabled"
                      :removeBundle="removeBundle"
                      :removeGift="removeGift"
                    />
                  </template>
                </v-dialog>
                <div>
                  <Icon
                    name="material-symbols:close"
                    @click="toggleModal"
                    class="!text-black !text-[20px] my-auto !cursor-pointer"
                  />
                </div>
              </div>
              <div class="content-modal pt-1 px-4 md:px-6 pb-2">
                <div class="delivery-info mt-3">
                  <div class="info-card">
                    <div class="flex justify-center">
                      <h2
                        class="text-black font-almarai text-[14px] font-bold leading-[16.8px]"
                      >
                        بيانات التوصيل
                      </h2>
                    </div>

                    <div class="mt-5">
                      <label
                        for="fullNameInput"
                        class="form-label text-black font-almarai text-[12px] font-bold leading-[14.4px] text-right !mb-3"
                      >
                        الاسم
                      </label>
                      <input
                        type="text"
                        class="form-control"
                        id="fullNameInput"
                        v-model="form.fullName"
                        placeholder="الاسم"
                      />
                      <div v-if="errors.fullName" class="text-red-500 mt-2">
                        {{ errors.fullName }}
                      </div>
                    </div>
                    <div class="mt-3">
                      <label
                        for="phoneNumberInput"
                        class="form-label text-black font-almarai text-[12px] font-bold leading-[14.4px] text-right !mb-3"
                      >
                        تأكيد رقم الجوال (واتس أب)
                      </label>
                      <div class="flex mb-3">
                        <a-input-group class="phone-input" compact>
                          <a-select v-model:value="value1" style="width: 30%">
                            <a-select-option value="+966">+966</a-select-option>
                            <a-select-option value="+20">+20</a-select-option>
                          </a-select>
                          <a-input
                            placeholder=""
                            v-model:value="value2"
                            style="width: 70%"
                          />
                          <!-- <a-button
                            class="bg-black text-white px-[10px] sm:px-[18px] md:px-[24px] !rounded-r-[4px] font-almarai text-[12px] font-bold leading-[14.4px] flex items-center text-center justify-center"
                            type="button"
                            id="button-addon1"
                            @click="verifyPhone"
                            :disabled="isLoadingPhone || otpConfirmed"
                            style="width: 18%"
                          >
                            <template v-if="isLoadingPhone">
                              <Icon
                                name="eos-icons:loading"
                                class="animate-spin w-4 h-4"
                              />
                            </template>
                            <template v-else>
                              <span class="mx-auto">تأكيد</span>
                            </template></a-button
                          > -->
                        </a-input-group>
                      </div>
                      <div v-if="errorPhone" class="text-red-500 mt-2">
                        {{ errorPhone }}
                      </div>
                      <div v-if="errors.phoneNumber" class="text-red-500 mt-2">
                        {{ errors.phoneNumber }}
                      </div>
                      <div v-if="errors.otp" class="text-red-500 mt-2">
                        {{ errors.otp }}
                      </div>
                      <div v-if="otpConfirmed" class="text-green-400 mt-2">
                        تم تأكيد رقم الجوال
                      </div>
                      <div v-if="showOtpPopup">
                        <div class="overlay" @click="closeOtpPopup"></div>
                        <div class="otp-popup">
                          <div class="popup-content">
                            <h3
                            class="font-almarai text-[14px] font-bold leading-[16.8px] text-right mb-2 flex items-center justify-start align-center"
                          >
                          ادخل رمز التحقق المرسل الى رقم الواتساب الخاص بك                            <Icon name="logos:whatsapp-icon" class="text-green-500 mx-2 text-2xl my-auto" />
                          </h3>

                            <v-otp-input
                              length="5"
                              class="otp-inputs"
                              v-model="otpCodeNumber"
                            ></v-otp-input>
                            <div v-if="errorVerify" class="text-lg text-red-500">
                              {{ errorVerify }}
                            </div>
                            <div
                            class="terms-conditions"
                          >
                            <v-checkbox
                              label="سأقوم باستلم الطلب بدون تأخير وبدون التسبب لكم باي خسارة و الله على ما اقول شهيد"
                                          v-model="termsAndConditions"
                              class="single-line-checkbox"
                            />
                          </div>
                            <div class="flex w-full">
                              <v-btn
                                @click="submitOtp"
                                :loading="loadingSubmitOtp"
                                :disabled="!termsAndConditions"
                                class="bg-black rounded-lg w-full text-white py-2 px-4 mt-4 font-almarai text-[14px] font-bold leading-[16.8px]"
                              >
                                تأكيد
                              </v-btn>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <v-dialog
                    v-model="paymentMethodPopUp"
                    transition="dialog-top-transition"
                    max-width="500px"
                    min-height="450px"
                    class=""
                  >
                    <template v-slot:default="{ isActive }">
                      <div class="dialog-content">
                        <div class="payment-method">
                          <h2 class="ways-payment">طرق الدفع</h2>
              
                          <v-radio-group
                            v-model="selectedPaymentMethod"
                            row
                            class="payment-method-group"
                          >
                            <v-radio
                              label="الدفع عند الاستلام"
                              value="cash_on_delivery"
                            ></v-radio>
                            <v-radio
                              label="الدفع الالكترونى"
                              value="pay_online"
                            ></v-radio>
                          </v-radio-group>
                          <v-btn @click="submitForm" :loading="loadingPaymentMethod" :disabled="!selectedPaymentMethod" class="btn-submit-payment">
                            اتمام الدفع
                          </v-btn>
                        </div>
             
                      </div>
                    </template>
                  </v-dialog>
                  <v-dialog
                  v-model="confirmPaymentMethodPopUp"
                  transition="dialog-top-transition"
                  max-width="500px"
                  min-height="450px"
                  class=""
                  persistent
                >
                  <template v-slot:default="{ isActive }">
                    <div class="dialog-content">
                      <div class="payment-method">
                        <img src="@/assets/images/success-payment.svg" alt="">
                        <h2 class="confirm-payment">تمت العمليه بنجاح</h2>
            
    
                      </div>
           
                    </div>
                  </template>
                </v-dialog>
                    <div class="mt-3">
                      <label
                        for="citySelect"
                        class="form-label text-black font-almarai text-[12px] font-bold leading-[14.4px] text-right !mb-3"
                      >
                        المدينه
                      </label>
                      <v-autocomplete
                      v-model="form.selectedCity"
                      :items="cities"
                      item-value="value" 
                      item-title="label"
                      hide-details
                      class="select-city flex flex-row justify-center"
                      @update:model-value="handleChange"
                    >
                     
                      
              <template v-slot:placeholder="{ props }">
                <div
        v-bind="props"
                class="text-center "
              >
              المدينه
              </div>
              </template>
              <template v-slot:item="{ props,  item }">
                <div
        v-bind="props"
                class="text-center cursor-pointer my-2"
              >
                {{ item.title }}
              </div>
              </template>
                    </v-autocomplete>
                      <div v-if="errors.selectedCity" class="text-red-500 mt-2">
                        {{ errors.selectedCity }}
                      </div>
                    </div>
                    <div class="mt-3">
                      <label
                        for="placeInput"
                        class="form-label text-black font-almarai text-[12px] font-bold leading-[14.4px] text-right !mb-3"
                      >
                        الحى ووصف المكان
                      </label>
                      <input
                        type="text"
                        class="form-control"
                        id="placeInput"
                        v-model="form.place"
                        placeholder="الحى"
                      />
                      <div v-if="errors.place" class="text-red-500 mt-2">
                        {{ errors.place }}
                      </div>
                    </div>
                  </div>

                  <div class="mt-8">
                    <h2
                      v-if="bundles.length > 0"
                      class="text-black font-almarai text-center text-[14px] font-bold leading-[14.4px]"
                    >
                      عروض مميزة
                    </h2>
                    <div class="mt-3">
                      <div
                        class="mt-4 flex justify-center bg-gray-200 rounded-md py-4"
                        v-if="bundles.length === 0"
                      >
                        <h2 class="text-lg text-black text-bold">لا يوجد عروض</h2>
                      </div>
                      <div>
                        <Swiper
                          :slides-per-view="3"
                          space-between="15"
                          :breakpoints="{
                            320: {
                              slidesPerView: 2,
                              spaceBetween: 10,
                            },
                            419: {
                              slidesPerView: 2.2,
                              spaceBetween: 20,
                            },
                            768: {
                              slidesPerView: 3,
                              spaceBetween: 15,
                            },
                            1024: {
                              slidesPerView: 2.5,
                              spaceBetween: 15,
                            },
                          }"
                          class="mySwiper !p-0 md:!p-3"
                          loop="true"
                        >
                          <SwiperSlide
                            v-for="bundle in bundles"
                            :key="bundle.id"
                            class="!h-48 pt-2 box-border"
                          >
                            <BundleCard
                              :bundle="bundle"
                              :selectedBundles="selectedBundles"
                              :toggleSelectBundle="toggleSelectBundle"
                            />
                          </SwiperSlide>
                        </Swiper>
                      </div>
                    </div>
                  </div>
                  <div
                    v-if="
                      campaignInfo.has_discount === 1 ||
                      campaignInfo.has_free_shipping === 1 ||
                      gifts.length > 0
                    "
                    class="mt-4"
                  >
                    <h2
                      class="text-black font-almarai text-center text-[12px] font-bold leading-[14.4px]"
                    >
                      اختر هديتك المجانيه .. ❤
                      <br />
                      ( ملاحظه : لكى تفتح الهدايا يجب عليك اضافة عرض مميز من الأعلى ☝ )
                    </h2>
                    <div class="mt-3">
                      <div>
                        <Swiper
                          :slides-per-view="2.5"
                          space-between="20"
                          :breakpoints="{
                            320: {
                              slidesPerView: 2,
                              spaceBetween: 8,
                            },
                            419: {
                              slidesPerView: 2.5,
                              spaceBetween: 8,
                            },
                            768: {
                              slidesPerView: 3,
                              spaceBetween: 15,
                            },
                            1024: {
                              slidesPerView: 2.5,
                              spaceBetween: 20,
                            },
                          }"
                          class="mySwiper !py-2 !px-0 md:!py-3 md:!px-0"
                          loop="true"
                        >
                          <SwiperSlide
                            v-for="gift in gifts"
                            :key="gift.id"
                            class="!h-44 !relative"
                          >
                          <GiftCard
                          :gift="gift"
                          :isDisabled="isDisabled"
                          :isSelected="selectedGifts.some((item) => item.id === gift.id)"
                  
                            :toggleSelectGifts="toggleSelectGifts"
                          :selectedGifts="selectedGifts"
                        />
                          </SwiperSlide>

                          <SwiperSlide
                            v-if="campaignInfo.has_free_shipping === 1"
                            class="!h-44 !relative"
                          >
                          <FreeShippingCard
                          :gift="freeShipping"
                          :isDisabled="isDisabled"
                          :isSelected="selectedGifts.some((item) => item.id === freeShipping.id)"
                  
                            :toggleSelectGifts="toggleSelectGifts"
                          :selectedGifts="selectedGifts"
                        />
                          </SwiperSlide>

                          <SwiperSlide
                            v-if="campaignInfo.has_discount === 1"
                            class="!h-44 !relative"
                          >
                          <DiscountAmountCard
                          :gift="discountAmount"
                          :isDisabled="isDisabled"
                          :isSelected="selectedGifts.some((item) => item.id === discountAmount.id)"
                  
                            :toggleSelectGifts="toggleSelectGifts"
                          :selectedGifts="selectedGifts"
                        />
                          </SwiperSlide>
                        </Swiper>
                      </div>
                    </div>
                  </div>
                  <PaymentDetails
                    :selectedCardData="selectedCardData"
                    :selectedBundles="selectedBundles"
                    :selectedGifts="selectedGifts"
                    :discountAmount="discountAmount"
                    :selectedCityData="selectedCityData"
                    :totalOrderPrice="totalOrderPrice"
                    :totalOrderPriceAfterDiscount="totalOrderPriceAfterDiscount"
                    :hasDiscountInGifts="hasDiscountInGifts"
                    :showDelivery="showDelivery"
                    :isDisabled="isDisabled"
                    :removeBundle="removeBundle"
                    :removeGift="removeGift"
                  />
                  <div
                    class="fixed bottom-0 inset-x-0 z-10 bg-white py-2 mt-4 !px-7 md:!px-11"
                  >
                    <div class="flex flex-col gap-2 justify-center w-full">
                      <div>
                        <v-btn
                          class="w-full bg-black py-2 text-white flex items-center justify-center rounded-lg font-almarai text-[12px] font-bold leading-[14.4px]"
                          @click="verifyPhone"
                          :loading="loadingVerifyOtp"
                        >
                        {{ campaignInfo?.payment_button_word }}

                      </v-btn>
                      </div>
                      <div>
                        <img src="https://i.postimg.cc/sDGwfNmD/payment.png" alt="" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </template>
    <Toast :message="toastMessage" />
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue";

// import { useHead } from '@vueuse/head';
// import payment from "assets/images/payment.svg"
import Toast from "~/components/Toast.vue";
import "swiper/css";
import "swiper/css/navigation";
// Import required modules
import { Navigation } from "swiper/modules";

const modules = [Navigation];
const route = useRoute();
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/swiper-bundle.css";
const mySwiperRef = ref(null);
const swiperInstance = ref(null);
const currentSlide = ref(0);
const cards = ref([]);
const bundles = ref([]);
const gifts = ref([]);
const selectedCardId = ref(null);
const selectedCardData = ref(null);
const error = ref(null);
const isLoading = ref(true);
const loadingVerifyOtp = ref(false);
const userComments = ref([]);
// const displayedComments = ref([]);
const usersReviews = ref([]);
// const showLoadMoreButton = ref(true);
const tabs = ref([
  { title: "الوصف", value: "0" },
  { title: "الصور", value: "1" },
  { title: "التقييمات", value: "2" },
  { title: "المراجعات", value: "3" },
]);
const campaignInfo = ref({});
const currentTab = ref(0);
// const isActive = ref(false);
const selectedGift = ref({
  price: "0.00",
});
const selectedBundles = ref([]);
const isPopupVisible = ref(false);
const showModal = ref(false);
const modalAnimationClass = ref("modal-top");
const otpConfirmed = ref(false);
const showOtpPopup = ref(false);
const errorPhone = ref(null);
const isLoadingPhone = ref(false);
const errorVerify = ref(null);
const isLoadingVerify = ref(false);
const confirmPaymentMethodPopUp = ref(false);
const value1 = ref("+966");
const value2 = ref();
const socialLinks = ref([]);
const paymentMethodPopUp = ref(false)
const selectedPaymentMethod = ref(""); 
const termsAndConditions = ref(false); 
const loadingPaymentMethod = ref(false);
const freeShipping = ref({
  id: "has_free_shipping",
  name_ar: "توصيل مجانى",
  name_en: "Free Shipping",
  name: "Free Shipping",
  description: null,
  price: "0.00",
  price_before_discount: null,
  image: "https://i.postimg.cc/rwsv0w7m/image.png",
});
const config = useRuntimeConfig();
console.log(config.public.URL);
const canvas = ref(null);
const video = ref(null);

const playingVideoId = ref(null); // To track the currently playing video

// Function to handle play event
const handlePlay = (videoId) => {
  if (playingVideoId.value !== videoId) {
    // Pause the currently playing video
    const currentVideo = document.getElementById(playingVideoId.value);
    if (currentVideo && !currentVideo.paused) {
      currentVideo.pause();
    }
    // Update to the new playing video ID
    playingVideoId.value = videoId;
  }
};

// Function to handle pause event
const handlePause = (videoId) => {
  // Clear the playing video ID only if it matches the current video
  if (playingVideoId.value === videoId) {
    playingVideoId.value = null;
  }
};
// Draw the first frame of the video onto the canvas
const drawCanvas = () => {
  const canvasEl = canvas.value; // Assign the canvas element to a variable
  const videoEl = video.value; // Assign the video element to a variable

  if (canvasEl && videoEl) {
    const context = canvasEl.getContext("2d"); // Get the context of the canvas

    canvasEl.width = videoEl.videoWidth; // Set the canvas width to the video width
    canvasEl.height = videoEl.videoHeight; // Set the canvas height to the video height

    videoEl.currentTime = 0; // Set the current time to the beginning
    videoEl.addEventListener(
      "loadeddata",
      () => {
        context.drawImage(videoEl, 0, 0, canvasEl.width, canvasEl.height); // Draw the image onto the canvas
      },
      { once: true }
    );
  }
};

// Ensure canvas reference is available on mount
onMounted(() => {
  // Call drawCanvas only if video is defined
  if (video.value) {
    drawCanvas();
  }
});
const cities = ref([]);
const form = reactive({
  fullName: "",
  phoneNumber: "",
  selectedCity: "",
  place: "",
});
watch(value2, (newValue) => {
  form.phoneNumber = value1.value.replace("+", "") + newValue;
});
// Error state
const errors = reactive({
  fullName: null,
  phoneNumber: null,
  selectedCity: null,
  place: null,
  otp: null,
});
// Ref to hold the selected city object
const selectedCity = ref(null);
const selectedCityObject = ref(null);
const isDisabled = computed(() => selectedBundles.value.length === 0);

// Watch for changes in isDisabled

// Method to toggle gift selection

const selectedGifts = ref([]); // Reactive array for selected gifts
const selectedGiftIds = ref([]); // Reactive array for selected gift IDs

watch(isDisabled, (newValue) => {
  // If no bundles are selected (isDisabled becomes false)
  if (newValue === false) {
    // Reset selectedGift to an empty object
    selectedGifts.value = [];
  }
});

function discountPercentage(priceBeforeDiscount, currentPrice) {
  if (priceBeforeDiscount && currentPrice && priceBeforeDiscount > currentPrice) {
    const discount = ((priceBeforeDiscount - currentPrice) / priceBeforeDiscount) * 100;
    return Math.round(discount); // Return the rounded percentage
  }
  return 0; // No discount if conditions are not met
}
function toggleSelectGifts(gift) {
  // Prevent selection if isDisabled is true
  if (!isDisabled.value) {
    const index = selectedGifts.value.findIndex(
      (selectedGift) => selectedGift.id === gift.id
    );

    if (index !== -1) {
      // Gift is already selected, so deselect it
      selectedGifts.value.splice(index, 1); // Remove the gift from the array
      selectedGiftIds.value.splice(selectedGiftIds.value.indexOf(gift.id), 1); // Remove the ID from the IDs array
    } else {
      // Gift is not selected, so select it
      selectedGifts.value.push(gift); // Add the gift to the array
      selectedGiftIds.value.push(gift.id); // Add the ID to the IDs array
    }
  }

  console.log("Selected Gift IDs:", selectedGiftIds.value);
}

// Watch for changes in `showModal` and update the animation class
watch(showModal, (newVal) => {
  if (newVal) {
    modalAnimationClass.value = "modal-top"; // slideUp on open
  } else {
    modalAnimationClass.value = "modal-bottom"; // slideDown on close
  }
});
const toastMessage = ref("");

function showToast(message) {
  toastMessage.value = message;
  setTimeout(() => {
    toastMessage.value = "";
  }, 3000);
}

function toggleModal() {
  if (!selectedCardData.value) {
    showToast("اختر منتج أولا");
    return;
  }
  showModal.value = !showModal.value;
}
const digits = reactive(Array(5).fill(null)); // Initialize with 5 null values
const otpCodeNumber = ref();
const otpCont = ref(null);

// Handle input event to restrict to numbers and focus the next input if filled
const handleInput = (event, index) => {
  const value = event.target.value;

  // Only allow digits (0-9)
  if (/^\d*$/.test(value)) {
    digits[index] = value;
  } else {
    digits[index] = "";
  }

  // Automatically focus the next input field if the current one is filled
  if (digits[index] && index < digits.length - 1) {
    const nextInput = otpCont.value.children[index + 1];
    if (nextInput) {
      nextInput.focus();
    }
  }
};

// Handle backspace to remove value and move focus if needed// Handle backspace to remove value and move focus if needed
const handleBackspace = (event, index) => {
  // Check if the pressed key is Backspace
  if (event.key === "Backspace") {
    // Clear current input if it's not empty
    if (digits[index] !== "") {
      digits[index] = ""; // Clear current input
      event.preventDefault(); // Prevent the default backspace behavior (i.e., moving focus to previous)
    }
    // If current input is empty, move to the previous one
    else if (index > 0) {
      const prevInput = otpCont.value.children[index - 1];
      if (prevInput) {
        prevInput.focus();
        digits[index - 1] = ""; // Clear the previous input
        event.preventDefault(); // Prevent default behavior
      }
    }
  } else {
    // Allow only digits (0-9) and control keys (Backspace, Delete)
    if (
      !/^[0-9]$/.test(event.key) &&
      event.key !== "Backspace" &&
      event.key !== "Delete"
    ) {
      event.preventDefault(); // Prevent non-digit input
    }
  }
};
// Function to toggle selection
const toggleSelectBundle = (bundle) => {
  const index = selectedBundles.value.findIndex((item) => item.id === bundle.id);
  if (index === -1) {
    // If not selected, add it
    selectedBundles.value.push(bundle);
  } else {
    // If selected, remove it
    selectedBundles.value.splice(index, 1);
  }
};

const totalPrice = computed(() => {
  return selectedBundles.value.reduce((sum, item) => sum + item.price, 0);
});

const totalOrderPrice = computed(() => {
  // Calculate individual prices
  const cardPrice = parseFloat(selectedCardData.value.price) || 0;
  const bundlesPrice = selectedBundles.value.reduce((sum, item) => {
    return sum + (parseFloat(item.price) || 0);
  }, 0);

  // Calculate total gift price by filtering out gifts with 'has_free_shipping' or 'has_discount'
  const giftPrice = selectedGifts.value.reduce((sum, gift) => {
    if (gift.id !== "has_free_shipping" && gift.id !== "has_discount") {
      return sum + (parseFloat(gift.price) || 0);
    }
    return sum;
  }, 0);

  // Add city price only if 'has_free_shipping' is not present in selectedGifts
  const hasFreeShipping = selectedGifts.value.some(
    (gift) => gift.id === "has_free_shipping"
  );
  const cityPrice = !hasFreeShipping ? parseFloat(selectedCityData.value?.price) || 0 : 0;

  // Calculate total
  const total = cardPrice + bundlesPrice + giftPrice + cityPrice;
  return total;
});
const hasDiscountInGifts = computed(() => {
  return selectedGiftIds.value.includes("has_discount");
});

const totalOrderPriceAfterDiscount = computed(() => {
  let total = totalOrderPrice.value; // Start with the total price before discount

  // Check if 'has_discount' is present in selectedGiftIds
  const hasDiscountInGifts = selectedGiftIds.value.includes("has_discount");

  // Apply discount only if campaignInfo.has_discount is 1 and 'has_discount' exists in selectedGiftIds
  if (campaignInfo.value.has_discount === 1 && hasDiscountInGifts) {
    const discountValue = parseFloat(campaignInfo.value.discount_value) || 0;

    // Apply the discount based on discount type
    if (campaignInfo.value.discount_type === "fixed") {
      // Subtract the fixed discount
      total = total - discountValue;
    } else if (campaignInfo.value.discount_type === "percentage") {
      // Apply percentage discount
      const discountAmount = total * (discountValue / 100);
      total = total - discountAmount;
    }
  }

  // Ensure the total is not negative
  return total > 0 ? total : 0;
});

// Function to toggle the popup visibility
const togglePopup = () => {
  isPopupVisible.value = !isPopupVisible.value;
};

//  accordion

// const toggleAccordion = () => {
//   isActive.value = !isActive.value;
// };

function selectTab(index) {
  currentTab.value = index;
}


const verifyPhone = async () => {

   // Reset errors before validation
   resetErrors();

// Validate each field
if (!form.fullName) {
  errors.fullName = "الاسم مطلوب";
}

if (!form.phoneNumber) {
  errors.phoneNumber = "رقم الجوال مطلوب";
} else if (!/^\d+$/.test(form.phoneNumber)) {
  errors.phoneNumber = "رقم الجوال غير صحيح";
}

if (!form.selectedCity) {
  errors.selectedCity = "المدينة مطلوبة";
}

if (!form.place) {
  errors.place = "وصف المكان مطلوب";
}

// if (otpConfirmed.value === false) {
//   errors.otp = "يجب تأكيد رقم الجوال";
// }

// If there are errors, scroll to the first error element
if (Object.values(errors).some((error) => error)) {
  scrollToFirstError();
  return;
}
  isLoadingPhone.value = true;
  loadingVerifyOtp.value = true;
  errorPhone.value = null;
  try {
    const body = {
      whatsapp_number: value1.value.replace("+", "") + value2.value,
    };

    const { data } = await useFetch(`https://cp.4upsale.com/api/v1/campaign/verify/whatsapp`, {
      method: "POST",
      body: body,
    });

    console.log("Verify", data);
    if (data.value?.status === true) {
      showOtpPopup.value = true;
  loadingVerifyOtp.value = false;

    } else {

      useNuxtApp().$toast.error(data.value?.message);

      loadingVerifyOtp.value = false;
    }
  } catch (err) {
    // errorPhone.value = err.message; // Set error message
    // toastMessage.value = err.message;
    console.log('====================================');
    console.log("err" , err);
    console.log('====================================');
    useNuxtApp().$toast.error(err.message);
  loadingVerifyOtp.value = false;

  } finally {
    isLoadingPhone.value = false;
  }
};
const loadingSubmitOtp = ref(false);

const submitOtp = async () => {

 if (termsAndConditions.value ) {
  const otp = digits.join("");
  isLoadingVerify.value = true;
  loadingSubmitOtp.value = true
  errorVerify.value = null; // Reset error message
  try {
    const body = {
      whatsapp_number: value1.value.replace("+", "") + value2.value,
      otp: otpCodeNumber.value,
    };

    const { data } = await useFetch(`https://cp.4upsale.com/api/v1/campaign/verify/otp`, {
      method: "POST",
      body: body,
      headers: {
        ACCEPT_LANGUAGE: "ar",
      },
    });

    console.log("Verify", data);

    // Assuming response success opens the OTP input
    if (data.value.status === true) {
      loadingSubmitOtp.value = false

      otpConfirmed.value = true;
      otpCodeNumber.value = "";
      errors.otp = null;
      showOtpPopup.value = false;
      paymentMethodPopUp.value = true;
    } else {
      useNuxtApp().$toast.error(data.value.message);
  loadingSubmitOtp.value = false

    }
  } catch (err) {
    useNuxtApp().$toast.error(err.message);
    loadingSubmitOtp.value = false
  } finally {
    isLoadingVerify.value = false;
    loadingSubmitOtp.value = false

  }
}
  // Close the popup after submission
};
watch(otpCodeNumber, (newCode) => {
  if (newCode.length === 5 && /^\d+$/.test(newCode)) {
    submitOtp();
  }
});
const setMetaTags = (campaign) => {
  useHead({
    title: campaign.meta_title || "Up Sale",
    meta: [
      {
        name: "description",
        content: campaign.meta_description || "Default Description",
      },
      { name: "keywords", content: campaign.meta_keywords || "Default Keywords" },
    ],
    link: [{ rel: "icon", href: campaign.store_logo }],
  });
};
const fetchCampaign = async () => {
  try {
    const response = await fetch(
      `https://cp.4upsale.com/api/v1/campaign/${route.params.store}/${route.params.uuid}`,
      {
        headers: {
          ACCEPT_LANGUAGE: "ar",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (data.campaign) {
      campaignInfo.value = data.campaign;
      setMetaTags(data.campaign);
      socialLinks.value = data.campaign.store_social_links.filter(
        (link) => link.url !== null
      );
    }
  } catch (err) {
    error.value = "Error fetching products: " + err.message;
    console.error("Error fetching products:", err);
  } finally {
    isLoading.value = false;
  }
};
const discountAmount = computed(() => ({
  id: "has_discount",
  name_ar: "خصم",
  name_en: "خصم",
  name:
    campaignInfo.value.discount_type === "fixed"
      ? `خصم بقيمة ${campaignInfo.value.discount_value} ر.س`
      : `خصم بقيمة ${campaignInfo.value.discount_value} %`,
  description: null,
  price:
    campaignInfo.value.discount_type === "fixed"
      ? `  ${campaignInfo.value.discount_value} ر.س`
      : `  ${campaignInfo.value.discount_value} %`,
  price_before_discount: null,
  image: "https://i.postimg.cc/L5rx0jmQ/discount.png",
}));
const fetchProducts = async () => {
  try {
    const response = await fetch(
      `https://cp.4upsale.com/api/v1/campaign/products/${route.params.uuid}`,
      {
        headers: {
          ACCEPT_LANGUAGE: "ar",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (data) {
      cards.value = data.data;
      selectedCardData.value = data?.data[0];
      selectedCardId.value = data?.data[0]?.id;
      userComments.value = selectedCardData.value.ratings
        .map((rating) => (!rating.video && !rating.image ? rating : null))
        .filter(Boolean); // Filter out null values

      usersReviews.value = selectedCardData.value.ratings
        .map((rating) => (rating.video || rating.image ? rating : null))
        .filter(Boolean); // Filter out null values

      tabs.value = [
        { title: "الوصف", value: "0", count: 0 },
        { title: "الصور", value: "1", count: 0 },
        { title: "التقييمات", value: "2", count: userComments.value.length },
        { title: "المراجعات", value: "3", count: usersReviews.value.length },
      ];

      // showLoadMoreButton.value =
      //   userComments.value.length > 2 && displayedComments.value.length === 2;
      // if (userComments.value.length > 0) {
      //   displayedComments.value = userComments.value.slice(0, 2);
      // }
    }
  } catch (err) {
    error.value = "Error fetching products: " + err.message;
    console.error("Error fetching products:", err);
  } finally {
    isLoading.value = false;
  }
};

watch(selectedCardData, (newVal) => {
  if ( campaignInfo.value?.direct) {
    // Check if the tab already exists in the `tabs` array
    const directTabExists = tabs.value.some((tab) => tab.value === "4");

    if (!directTabExists) {
      tabs.value.push({
        title: "مباشر",
        value: "4",
        count: 0,
      });
    }
  }
});
const fetchCities = async () => {
  try {
    const response = await fetch(
      `https://cp.4upsale.com/api/v1/campaign/get-cities/${route.params.uuid}`,
      {
        headers: {
          ACCEPT_LANGUAGE: "ar",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (data) {
      console.log("cities" + data.data);

      cities.value = data.data.map((city) => ({
        value: city.id,
        label: city.name,
        price: city.price,
      }));
    }
  } catch (err) {
    error.value = "Error fetching products: " + err.message;
    console.error("Error fetching products:", err);
  } finally {
    isLoading.value = false;
  }
};
const showDelivery = ref(false);

const selectedCityData = computed(() => {
  return cities.value.find((city) => city.value === form.selectedCity) || {};
});

const fetchBundles = async () => {
  try {
    const response = await fetch(
      `https://cp.4upsale.com/api/v1/campaign/bundles/${route.params.uuid}`,
      {
        headers: {
          ACCEPT_LANGUAGE: "ar",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (data) {
      console.log("bundles", data.data);
      bundles.value = data.data;
    }
  } catch (err) {
    error.value = "Error fetching products: " + err.message;
    console.error("Error fetching products:", err);
  } finally {
    isLoading.value = false;
  }
};
const fetchGifts = async () => {
  try {
    const response = await fetch(
      `https://cp.4upsale.com/api/v1/campaign/gifts/${route.params.uuid}`,
      {
        headers: {
          ACCEPT_LANGUAGE: "ar",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (data) {
      console.log("gifts", data.data);
      gifts.value = data.data;
    }
  } catch (err) {
    error.value = "Error fetching products: " + err.message;
    console.error("Error fetching products:", err);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchCampaign();
  fetchProducts();
  fetchCities();
  fetchBundles();
  fetchGifts();
});
// Watch for changes in form.fullName
watch(
  () => form.fullName,
  (newVal) => {
    if (newVal) {
      errors.fullName = null;
    }
  }
);

// Watch for changes in form.place
watch(
  () => form.place,
  (newVal) => {
    if (newVal) {
      errors.place = null;
    }
  }
);

// Watch for changes in form.selectedCity
watch(
  () => form.selectedCity,
  (newVal) => {
    if (newVal) {
      errors.selectedCity = null;
    }
  }
);

// Watch for changes in form.phoneNumber
watch(
  () => form.phoneNumber,
  (newVal) => {
    if (newVal) {
      errors.phoneNumber = null;
    }
  }
);

const openPopupWindow = (url) => {
  const width = 600;
  const height = 400;
  const left = (window.screen.width - width) / 2;
  const top = (window.screen.height - height) / 2;

  // Open a popup window with custom features
  window.open(
    url,
    "popup",
    `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes`
  );
};

import { toast } from "vue3-toastify";

const submitForm = async () => {
  loadingPaymentMethod.value = true;

  // Proceed if OTP is confirmed
  if (otpConfirmed.value === true) {
    const body = {
      phone_number: form.phoneNumber,
      name: form.fullName,
      details: form.place,
      city_id: form.selectedCity,
      product_id: selectedCardData.value.id,
      gift: selectedGiftIds?.value || null,
      bundle_ids: selectedBundles.value.map((bundle) => bundle.id),
      payment_method: selectedPaymentMethod.value,
    };

    try {
      const { data, error } = await useFetch(
        `https://cp.4upsale.com/api/v1/campaign/create-order/${route.params.uuid}`,
        {
          method: "POST",
          body: body,
          headers: {
            ACCEPT_LANGUAGE: "ar",
          },
        }
      );

      if (error?.value) {
        // Extract the error message
        const errorMessage = error.value.data?.message || "حدث خطأ غير متوقع";
        toast.error(errorMessage); // Display the error message in a toast

        // Extract specific errors if available
        let errorsArray = error.value.data?.errors || {};
        if (errorsArray.name && Array.isArray(errorsArray.name) && errorsArray.name.length > 0) {
          errors.fullName = errorsArray.name[0];
        }

        loadingPaymentMethod.value = false;
      } else {
        // Handle success response
        if (selectedPaymentMethod.value === "pay_online") {
          if (data?.value?.url) {
            window.location.href = data.value.url;
            paymentMethodPopUp.value = false;
          } else {
            // toast.error("الرابط غير متوفر للدفع عبر الإنترنت");
          }
        } else {
          confirmPaymentMethodPopUp.value = true;
        }

        loadingPaymentMethod.value = false;
        paymentMethodPopUp.value = false;
      }
    } catch (err) {
      console.error("Error:", err);
      // toast.error(err.message || "خطأ في الاتصال بالخادم");
      useNuxtApp().$toast.error(err.message );

      loadingPaymentMethod.value = false;
    }
  }
};

// Watch for changes to confirmPaymentMethodPopUp
watch(confirmPaymentMethodPopUp, (newValue) => {
  if (newValue === true) {
    setTimeout(() => {
      window.location.reload();
    }, 1500); // Wait for 3 seconds before reloading the page
  }
});
const scrollToFirstError = () => {
  const errorKeys = Object.keys(errors);
  for (const key of errorKeys) {
    if (errors[key]) {
      const element = document.getElementById(`${key}Input`);
      if (element) {
        element.scrollIntoView({
          behavior: "smooth",  // Enables smooth scrolling
          block: "center",     // Centers the input vertically on the screen
        });
        element.focus({ preventScroll: true }); // Prevents immediate jump on focus
        break;
      }
    }
  }
};



const resetErrors = () => {
  errors.fullName = null;
  errors.phoneNumber = null;
  errors.selectedCity = null;
  errors.place = null;
};
// In your setup function, ensure `detailsContent` is defined
const detailsContent = ref(null);

const selectCard = (card, scroll) => {
  if (selectedCardId.value === card.id) {
    if (scroll) {
    // Scroll to the details section smoothly
    nextTick(() => {
      const detailsSection = detailsContent.value; // Access the ref
      if (detailsSection) {
        detailsSection.scrollIntoView({ behavior: "smooth" });
      }
    });
  }
  } else {
    selectedCardId.value = card.id;
  selectedCardData.value = card;
  currentTab.value = 0;

  userComments.value = card.ratings
    .map((rating) => (!rating.video && !rating.image ? rating : null))
    .filter(Boolean);

  usersReviews.value = card.ratings
    .map((rating) => (rating.video || rating.image ? rating : null))
    .filter(Boolean);

  tabs.value = [
    { title: "الوصف", value: "0", count: 0 },
    { title: "الصور", value: "1", count: 0 },
    { title: "التقييمات", value: "2", count: userComments.value.length },
    { title: "المراجعات", value: "3", count: usersReviews.value.length },
  ];

  // Get the index of the selected card
  const selectedIndex = cards.value.findIndex((c) => c.id === card.id);

  // Set the active index on the Swiper instance
  if (swiperInstance.value && selectedIndex !== -1) {
    swiperInstance.value.slideTo(selectedIndex); // Use slideTo method to change active slide
  }

  if (scroll) {
    // Scroll to the details section smoothly
    nextTick(() => {
      const detailsSection = detailsContent.value; // Access the ref
      if (detailsSection) {
        detailsSection.scrollIntoView({ behavior: "smooth" });
      }
    });
  }
  }

 
};

// Capture the swiper instance when it's ready
const onSwiperInit = (swiper) => {
  swiperInstance.value = swiper;
};

// Function to handle active slide change
const onSlideChange = () => {
  if (!swiperInstance.value || !swiperInstance.value.slides) {
    console.warn("Swiper instance or slides not available.");
    return;
  }

  const activeSlideIndex = swiperInstance.value.activeIndex;
  const activeCard = cards.value[activeSlideIndex];
  if (activeCard) {
    selectCard(activeCard, false);
  }
};

// Watch for changes to swiper's active slide
watch(
  () => swiperInstance.value?.activeIndex,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
      onSlideChange();
    }
  }
);

onMounted(() => {
  if (swiperInstance.value) {
    onSlideChange(); // Run when the swiper is ready
  }
});

// const loadMoreComments = () => {
//   displayedComments.value = userComments.value;
//   showLoadMoreButton.value = true;
// };
const sortNewestFirst = ref(true); // State to track sorting order
const sortButtonText = ref("الأحدث"); // Initialize with "newest" text

const toggleSort = () => {
  sortNewestFirst.value = !sortNewestFirst.value;

  userComments.value.sort((a, b) => {
    if (!sortNewestFirst.value) {
      return new Date(b.created_at) - new Date(a.created_at); // Newest first
    } else {
      return new Date(a.created_at) - new Date(b.created_at); // Oldest first
    }
  });

  // Update button text based on the sorting order
  sortButtonText.value = sortNewestFirst.value ? "الأحدث" : "الأقدم";

  // // After sorting, display the first 2 comments
  // displayedComments.value = userComments.value.slice(0, 2);
  // showLoadMoreButton.value = false;
};

watch(
  () => form.phoneNumber,
  (newValue, oldValue) => {
    otpConfirmed.value = false;
  }
);

watch(selectedBundles, (newValue) => {
  if (newValue.length === 0) {
    selectedGifts.value = [];
    selectedGiftIds.value = [];
  }
});

const handleChange = (value) => {
  console.log(`selected ${value}`);
  console.log("selectedCityData", selectedCityData.value);
  showDelivery.value = true;
  form.value.selectedCity = value;
};

const handleBlur = () => {
  console.log("blur");
};

const handleFocus = () => {
  console.log("focus");
};

const filterOption = (input, option) => {
  return option.label.toLowerCase().includes(input.toLowerCase());
};

const removeBundle = (bundleId) => {
  selectedBundles.value = selectedBundles.value.filter(
    (bundle) => bundle.id !== bundleId
  );
};
// const removeGift = () => {
//   isDisabled.value = true;
//   selectedGift.value = {}

// };
const removeGift = (giftId) => {
  const index = selectedGifts.value.findIndex((gift) => gift.id === giftId);
  if (index !== -1) {
    selectedGifts.value.splice(index, 1);
    if (selectedGifts.length === 0) {
      isDisabled.value = true;
    }
  }
};
const martNumber = computed(() => {
  let length = 0;

  // Check if selectedGift exists and has an id
  if (selectedGifts.value && selectedGifts.value.length) {
    length += selectedGifts.value.length;
  }

  // Check if selectedBundles is an array and get its length
  if (Array.isArray(selectedBundles.value)) {
    length += selectedBundles.value.length;
  }

  // Check if selectedCardData exists and is an object
  if (selectedCardData.value && typeof selectedCardData.value === "object") {
    length += 1;
  }

  return length;
});
const isMartDialogVisible = ref(false);
const visiblePopupMart = () => {
  isMartDialogVisible.value = true;
};


</script>
<style >
/* Carousel container customization */
.first-section .custom-carousel {
  height: 166px !important;
  padding: 0px;
  background: rgba(241, 241, 241, 1);
  border-radius: 6px !important;
}

/* Pagination dots outside the carousel */
.first-section .pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 12px;
}
@media (max-width: 500px) {
  .v-container {
    width: 100%;
    padding: 0px !important;
    margin-right: auto;
    margin-left: auto;
  }
}
.first-section .pagination-dot {
  width: 8px;
  height: 8px;
  margin: 0 6px;
  border-radius: 50%;
  background: rgba(217, 217, 217, 1);

  cursor: pointer;
}

.first-section .pagination-dot.active {
  background: rgba(0, 0, 0, 1);
}

.background-overlay-gift {
  position: absolute; /* Make it absolutely positioned */
  top: 0; /* Align to the top */
  left: 0; /* Align to the left */
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  background-color: rgba(
    0,
    0,
    0,
    0.5
  ); /* Semi-transparent background, adjust as necessary */
  z-index: 20;
  border-radius: 8px !important ;
}
.mart-contain {
  cursor: pointer;
}
.dialog-contain {
  border-radius: 8px !important;
  direction: rtl !important;
}

.gift-image-card .discount-badge {
  position: absolute;
  width: 55px;
  height: 20px;
  top: 3px;
  right: 0px;
  background-color: #000;
  color: white;
  border: 1px solid #fff;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  z-index: 10;
  font-family: "Almarai";
  font-size: 8px;
  font-weight: 400;
}
.swiper-backface-hidden .swiper-slide {
  display: flex !important;
  justify-content: center !important;
}
.link-style {
  font-family: "Almarai", sans-serif !important;
  font-size: 12px;
  font-weight: 400;
  line-height: 19.2px;
}
.ant-select-single.ant-select-show-arrow .ant-select-selection-item {
  text-align: center !important;
}
.ant-select-single {
  text-align: center !important;
}
.footer-styles p .text-tiny {
  font-size: 12px !important;
}
.dialog-content {
  background-color: white;
  padding: 16px;
  border-radius: 8px;
}
.payment-method .ways-payment {
  font-family: "Almarai", sans-serif !important;
font-size: 14px;
font-weight: 700;
line-height: 16.8px;
  text-align: center;
  margin-bottom: 20px;
}
.payment-method .confirm-payment {
  font-family: "Almarai", sans-serif !important;
  font-size: 24px;
  font-weight: 700;
  line-height: 34px;
  
  text-align: center;
  margin: 20px 0 40px;
}
.payment-method img {
  width:100px !important;
  height: 100px !important;
  margin: 20px auto 0 ;
}
.payment-method-group {
  gap: 16px; /* Add spacing between options */
  direction: rtl !important
}
.terms-conditions .single-line-checkbox {
direction: rtl !important;
  font-family: "Almarai", sans-serif !important;
  font-size: 12px;
  font-weight: 300;
  line-height: 16.8px;
  
}
.video-height {
  min-height: 300px;
}
.btn-submit-payment {
  background: rgba(0, 0, 0, 1);
  width: 100%;

  padding: 12px 8px ;
  border-radius: 8px;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "Almarai", sans-serif !important;
font-size: 14px;
font-weight: 700;
line-height: 16.8px;


  
}

.centered-options .ant-select-item {
  text-align: center;
}
.v-autocomplete .v-field .v-field__input {
  display: flex !important;
  text-align: center !important;
  justify-content: center !important;
  min-height: 45px !important;
  padding: 0px 8px !important;

}
.v-field--variant-filled .v-field__overlay  {
  display: block;
  width: 100%;
  padding: 0.375rem 0.75rem;


  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  background-color: white !important;
}
.v-field__field {

  padding: 0px 8px !important;

}
.v-field.v-field--appended {
  background-color: white !important;


}

.v-field__append-inner {
  background-color: white !important;


}

.v-input__control {
  background-color: white !important;
  border-radius: 8px;
  height: 47px !important;

  border: 1px solid rgba(217, 217, 217, 1);
}

.v-input--density-default .v-field--variant-filled {
  height: 45px;
  padding-bottom: 4px;
  border-radius: 8px;
  background-color: white !important;
  overflow: hidden;
}

.v-field__outline {
  display: none !important;
}
</style>
