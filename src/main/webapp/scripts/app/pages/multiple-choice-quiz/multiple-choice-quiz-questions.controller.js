'use strict';

angular.module('dictionaryApp')
    .controller('MultipleChoiceQuizQuestionController', function ($scope, $state, $modal, Language, WordSearch, TranslationSearch, Tag, MultipleChoiceQuiz, MultipleChoiceQuizQuestionService) {

        $scope.words = [];
        $scope.current_word_index = 0;
        $scope.total_num_words = 0;
        $scope.score = 0;
        $scope.quizResultId = -1;

        function getWords() {
            $scope.words = MultipleChoiceQuizQuestionService.getWords();
            $scope.total_num_words = $scope.words.length;
            if ($scope.total_num_words > 0) {
                $scope.loaded = true;
            } else {
                $scope.errorLoading = true;
            }
        }

        function getQuizResultId() {
            $scope.quizResultId = MultipleChoiceQuizQuestionService.getQuizResultId();
        }

        getWords();
        getQuizResultId();

        $scope.submit = function() {
            MultipleChoiceQuizQuestionService.setWords($scope.words);
            MultipleChoiceQuizQuestionService.setQuizResultId($scope.quizResultId);
            MultipleChoiceQuizQuestionService.submit().then(function(result) {
                $scope.received_answers = true;
                $scope.loaded = false;
                $scope.words = result.questions;
                calculateScore();
            }, function(error) {
                $scope.received_answers = false;
                $scope.loaded = false;
                $scope.errorLoading = false;
                $scope.errorSubmitting = true;
            });
        }

        $scope.isLastWord = function() {
            if ($scope.current_word_index < $scope.total_num_words - 1) {
                return false;
            }
            return true;
        }

        $scope.isFirstWord = function() {
            return $scope.current_word_index == 0;
        }

        $scope.previousWord = function() {
            if ($scope.isFirstWord()) {
                return;
            }
            $scope.current_word_index--;
        }

        $scope.nextWord = function() {
            if ($scope.isLastWord()) {
                return;
            }
            $scope.current_word_index++;
        }

        function calculateScore() {
            var num_correct_answers = 0;
            $scope.words.forEach(function(word) {
                if (word.answerWordId == word.correctAnswerWordId) {
                    num_correct_answers++;
                }
            });
            $scope.score = num_correct_answers / $scope.total_num_words * 100;
        }

    });
