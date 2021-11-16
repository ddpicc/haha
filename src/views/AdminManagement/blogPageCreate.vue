<template>
  <v-container
    fill-height
    fluid
    grid-list-xl
  >
    <v-row>
      <v-col
        cols="12"
        lg="8"
      >
				<tiptap-vuetify
          v-model="content"
          :extensions="extensions"
					min-height="500"
        />
			</v-col>
			<v-col
        cols="12"
        lg="4"
      >
				<v-card>
					<v-card-text>
						<v-form
							ref="blogForm"
							v-model="valid"
							lazy-validation
						>
							<v-row>
								<v-col cols="12">
									<v-text-field
										v-model="blogTitle"
										outlined
										label="标题"
										:rules="requiredRule"
									></v-text-field>
								</v-col>
								<v-col cols="12">
									<v-textarea
										outlined
										v-model="blogSummary"
										label="简介"
									></v-textarea>
								</v-col>
								<v-col cols="12">
									<v-select
										outlined
										:items="yesorno"
										v-model="stay_top"
										label="是否置顶"
									></v-select>
								</v-col>
								<v-col cols="12">
									<v-autocomplete
                    label="对谁可见"
                    :items="cacheAllUser"
                    :filter="customFilter"
                    clearable
                    :item-text="displayText"
                    item-value="id"
                    v-model="selectedUser"
                  >
                  <template v-slot:item="data">
                    <template>
                      <v-list-item-content>
                        <v-list-item-title>{{data.item.storage_number}}</v-list-item-title>
                        <v-list-item-subtitle>
                          姓名: {{data.item.name}}&nbsp;&nbsp;&nbsp;&nbsp;电话: {{data.item.user_phone}}&nbsp;&nbsp;&nbsp;&nbsp;邮箱: {{data.item.email}}
                        </v-list-item-subtitle>
                      </v-list-item-content>
                    </template>
                  </template>
                  </v-autocomplete>
								</v-col>
							</v-row>
						</v-form>
					</v-card-text>
					<v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="saveBlog">保存</v-btn>
          </v-card-actions>
				</v-card>
			</v-col>
		</v-row>
		<v-snackbar
      v-model="snackbar"
      :color="snackbarColor"
      :timeout="3000"
      top
      dark
    >
      <v-icon
        color="white"
        class="mr-3"
      >
        mdi-bell-plus
      </v-icon>
      {{notification}}
      <v-btn
        icon
        @click="snackbar = false"
      >
        <v-icon>
          mdi-close-circle
        </v-icon>
      </v-btn>
    </v-snackbar>
	</v-container>
</template>
<script>
	import { TiptapVuetify, Heading, Bold, Italic, Strike, Underline, Code, Paragraph, BulletList, OrderedList, ListItem, Link, Blockquote, HardBreak, HorizontalRule, History } from 'tiptap-vuetify'
  import {getNowTimeFormatDate} from '../../utils/helpFunction';
	export default {
    components: { TiptapVuetify },
    data () {
      return {
				extensions: [
					History,
					Blockquote,
					Link,
					Underline,
					Strike,
					Italic,
					ListItem,
					BulletList,
					OrderedList,
					[Heading, {
						options: {
							levels: [1, 2, 3]
						}
					}],
					Bold,
					Code,
					HorizontalRule,
					Paragraph,
					HardBreak
				],
				// starting editor's content
				content: '<p>This is a blog</p>',
				requiredRule: [
          v => !!v || 'Item is required',
      	],

				valid: false,
				yesorno: ['是','否'],
				stay_top: '是',
				cacheAllUser: [],
      	selectedUser: {
					storage_number: 'ALL',
					name: '所有人',
					email: '所有人',
				},
				blogTitle: '',
				blogSummary: '',
				snackbar: false,
        snackbarColor: '',
        notification: '',
				blogId: null,
			}
    },

		methods: {
			displayText: function(item){
        return item.storage_number + ' (' + item.name  + '    ' + item.email + ')';
      },

			customFilter (item, queryText, itemText) {
        const hasValue = val => val != null ? val : '';
        const query = hasValue(queryText).toUpperCase();

        //if(queryText.length < 2) return false;
        const textOne = item.storage_number;
        return textOne.indexOf(query) > -1;
      },

			saveBlog: function(){
				if(this.blogTitle == ''){
					alert('请输入文章标题');
				};
				if(this.blogSummary == ''){
					alert('请输入文章标题');
				}
				if(!this.blogId){
					this.$http.post('/api/news/createNews',{
						title: this.blogTitle,
						summary: this.blogSummary,
						content: this.content,
						created_at: getNowTimeFormatDate(),
						stay_top: this.stay_top == '是'? 1 : 0,
						to_storageNm: this.selectedUser.storage_number,
					}).then( (res) => {
						this.snackbar = true;
						this.notification = '保存成功';
						this.snackbarColor = 'green';
						this.blogId = res.data.insertId;
					})
				}else{
					this.$http.post('/api/news/updateNews',{
						title: this.blogTitle,
						summary: this.blogSummary,
						content: this.content,
						update_at: getNowTimeFormatDate(),
						stay_top: this.stay_top == '是'? 1 : 0,
						to_storageNm: this.selectedUser.storage_number,
						blogId: this.blogId,
					}).then( (res) => {
						this.snackbar = true;
						this.notification = '保存成功';
						this.snackbarColor = 'green';
						this.blogId = res.data.insertId;
					})
				}
				
			},

			getAllUser: function(){
        this.$http.get('/api/getAllUser').then( (res) => {
          this.cacheAllUser = res.data;
					this.cacheAllUser.unshift({
						storage_number: 'ALL',
						name: '所有人',
						email: '所有人',						
					});
        })
      },
		},

		mounted: function() {  
			this.getAllUser();
			if(this.blogId){
				this.$http.get('/api/news/getNewsById',{
          params: {
            id: this.blogId,
          }
        }).then( (res) => {
          this.blogTitle = res.data[0].title;
					this.blogSummary = res.data[0].summary;
					this.content = res.data[0].content;
					this.stay_top = res.data[0].stay_top == 1? '是' : '否';
        })
			}
		},

		created() {
      //todo change the way pass in params
			if(this.$route.query.blogId)
      	this.blogId = this.$route.query.blogId;
    },

	}
</script>